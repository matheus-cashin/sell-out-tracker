import { useState, useEffect } from "react";
import { StoresHeader } from "@/components/stores/StoresHeader";
import { AddStoreDialog } from "@/components/stores/AddStoreDialog";
import { StoresList } from "@/components/stores/StoresList";
import { AddVendorDialog } from "@/components/vendors/AddVendorDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: string;
  name: string;
  region: string;
  monthlyRevenue: number;
  address: string;
}

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .order("name");

      if (error) throw error;

      const formattedStores = data.map((store) => ({
        id: store.id,
        name: store.name,
        region: store.region,
        monthlyRevenue: Number(store.monthly_revenue) || 0,
        address: store.address,
      }));

      setStores(formattedStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast({
        title: "Erro ao carregar lojas",
        description: "Não foi possível carregar as lojas.",
        variant: "destructive",
      });
    }
  };

  const handleAddStore = async (store: Omit<Store, "id" | "monthlyRevenue">) => {
    try {
      const { data, error } = await supabase
        .from("stores")
        .insert({
          name: store.name,
          region: store.region,
          address: store.address,
          monthly_revenue: 0,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchStores();
      
      toast({
        title: "Loja cadastrada",
        description: "A loja foi adicionada com sucesso.",
      });

      return data.id;
    } catch (error) {
      console.error("Error adding store:", error);
      toast({
        title: "Erro ao cadastrar loja",
        description: "Não foi possível cadastrar a loja.",
        variant: "destructive",
      });
      return "";
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      const { error } = await supabase
        .from("stores")
        .delete()
        .eq("id", storeId);

      if (error) throw error;

      await fetchStores();
      
      toast({
        title: "Loja excluída",
        description: "A loja foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting store:", error);
      toast({
        title: "Erro ao excluir loja",
        description: "Não foi possível excluir a loja.",
        variant: "destructive",
      });
    }
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
      <StoresList 
        stores={stores} 
        onDeleteStore={handleDeleteStore}
        onOpenVendorDialog={(storeId) => {
          setSelectedStoreId(storeId);
          setVendorDialogOpen(true);
        }}
      />
      
      <AddVendorDialog
        stores={stores.map(s => ({ id: s.id, name: s.name }))}
        onAddVendor={async (vendor) => {
          try {
            const { error } = await supabase
              .from("vendors")
              .insert({
                name: vendor.name,
                cpf_cnpj: vendor.cpfCnpj,
                phone: vendor.phone,
                email: vendor.email,
                store_id: vendor.storeId,
              });

            if (error) throw error;

            toast({
              title: "Vendedor cadastrado",
              description: "O vendedor foi adicionado com sucesso.",
            });
          } catch (error) {
            console.error("Error adding vendor:", error);
            toast({
              title: "Erro ao cadastrar vendedor",
              description: "Não foi possível cadastrar o vendedor.",
              variant: "destructive",
            });
          }
        }}
        initialOpen={vendorDialogOpen}
        onOpenChange={setVendorDialogOpen}
        preSelectedStoreId={selectedStoreId}
      />
    </div>
  );
}
