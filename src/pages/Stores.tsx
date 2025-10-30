import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoresHeader } from "@/components/stores/StoresHeader";
import { AddStoreDialog } from "@/components/stores/AddStoreDialog";
import { StoresList } from "@/components/stores/StoresList";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: string;
  name: string;
  region: string;
  monthly_revenue: number;
  address: string;
}

export default function Stores() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Store[];
    },
  });

  const addStoreMutation = useMutation({
    mutationFn: async (store: Omit<Store, "id" | "monthly_revenue">) => {
      const { data, error } = await supabase
        .from('stores')
        .insert([{
          name: store.name,
          region: store.region,
          address: store.address,
          monthly_revenue: 0,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Loja cadastrada",
        description: "A loja foi adicionada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a loja",
        variant: "destructive",
      });
    },
  });

  const handleAddStore = (store: Omit<Store, "id" | "monthly_revenue">) => {
    addStoreMutation.mutate(store);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lojas</h1>
          <p className="text-muted-foreground">
            Gerencie as lojas cadastradas no sistema
          </p>
        </div>
        <AddStoreDialog onAddStore={handleAddStore} />
      </div>

      <StoresHeader totalStores={stores.length} />
      {isLoading ? (
        <div className="text-center py-8">Carregando lojas...</div>
      ) : (
        <StoresList stores={stores.map(s => ({
          ...s,
          monthlyRevenue: Number(s.monthly_revenue)
        }))} />
      )}
    </div>
  );
}
