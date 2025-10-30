import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VendorsHeader } from "@/components/vendors/VendorsHeader";
import { VendorsList } from "@/components/vendors/VendorsList";
import { AddVendorDialog } from "@/components/vendors/AddVendorDialog";
import { useToast } from "@/hooks/use-toast";

export interface Vendor {
  id: string;
  name: string;
  store: string;
  receiptsSubmitted: number;
  receiptsRejected: number;
  monthlySales: number;
}

export default function Vendors() {
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          id,
          name,
          receipts_submitted,
          receipts_rejected,
          monthly_sales,
          stores (
            name
          )
        `)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map(v => ({
        id: v.id,
        name: v.name,
        store: v.stores?.name || '',
        receiptsSubmitted: v.receipts_submitted || 0,
        receiptsRejected: v.receipts_rejected || 0,
        monthlySales: Number(v.monthly_sales) || 0,
      })) as Vendor[];
    },
  });

  const { data: stores = [] } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const totalRejected = vendors.reduce((acc, v) => acc + v.receiptsRejected, 0);
  const totalSales = vendors.reduce((acc, v) => acc + v.monthlySales, 0);

  // Estado para controlar a abertura do modal vindo de outra página
  const [initialModalOpen, setInitialModalOpen] = useState(false);
  const [preSelectedStore, setPreSelectedStore] = useState("");

  useEffect(() => {
    if (location.state?.openAddVendor) {
      setInitialModalOpen(true);
      if (location.state?.storeId) {
        setPreSelectedStore(location.state.storeId);
      }
    }
  }, [location.state]);

  const addVendorMutation = useMutation({
    mutationFn: async (vendorData: {
      name: string;
      cpfCnpj: string;
      phone: string;
      email: string;
      storeId: string;
    }) => {
      const { data, error } = await supabase
        .from('vendors')
        .insert([{
          name: vendorData.name,
          cpf_cnpj: vendorData.cpfCnpj,
          phone: vendorData.phone,
          email: vendorData.email,
          store_id: vendorData.storeId,
          receipts_submitted: 0,
          receipts_rejected: 0,
          monthly_sales: 0,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Vendedor cadastrado",
        description: "O vendedor foi adicionado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o vendedor",
        variant: "destructive",
      });
    },
  });

  const handleAddVendor = (vendorData: {
    name: string;
    cpfCnpj: string;
    phone: string;
    email: string;
    storeId: string;
  }) => {
    addVendorMutation.mutate(vendorData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendedores</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho dos vendedores
          </p>
        </div>
        <AddVendorDialog 
          stores={stores} 
          onAddVendor={handleAddVendor}
          initialOpen={initialModalOpen}
          preSelectedStoreId={preSelectedStore}
        />
      </div>

      <VendorsHeader 
        totalVendors={vendors.length}
        totalRejected={totalRejected}
        totalSales={totalSales}
      />
      {isLoading ? (
        <div className="text-center py-8">Carregando vendedores...</div>
      ) : (
        <VendorsList vendors={vendors} />
      )}
    </div>
  );
}
