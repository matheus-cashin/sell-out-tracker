import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { VendorsHeader } from "@/components/vendors/VendorsHeader";
import { VendorsList } from "@/components/vendors/VendorsList";
import { AddVendorDialog } from "@/components/vendors/AddVendorDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Vendor {
  id: string;
  name: string;
  store: string;
  receiptsSubmitted: number;
  receiptsRejected: number;
  monthlySales: number;
}

interface Store {
  id: string;
  name: string;
}

export default function Vendors() {
  const location = useLocation();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const { toast } = useToast();

  // Estado para controlar a abertura do modal vindo de outra página
  const [initialModalOpen, setInitialModalOpen] = useState(false);
  const [preSelectedStore, setPreSelectedStore] = useState("");

  useEffect(() => {
    fetchStores();
    fetchVendors();
  }, []);

  useEffect(() => {
    if (location.state?.openAddVendor) {
      setInitialModalOpen(true);
      if (location.state?.storeId) {
        setPreSelectedStore(location.state.storeId);
      }
    }
  }, [location.state]);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select(`
          *,
          stores (name)
        `)
        .order("name");

      if (error) throw error;

      const formattedVendors = data.map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        store: vendor.stores?.name || "",
        receiptsSubmitted: vendor.receipts_submitted || 0,
        receiptsRejected: vendor.receipts_rejected || 0,
        monthlySales: Number(vendor.monthly_sales) || 0,
      }));

      setVendors(formattedVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Erro ao carregar vendedores",
        description: "Não foi possível carregar os vendedores.",
        variant: "destructive",
      });
    }
  };

  const totalRejected = vendors.reduce((acc, v) => acc + v.receiptsRejected, 0);
  const totalSales = vendors.reduce((acc, v) => acc + v.monthlySales, 0);

  const handleAddVendor = async (vendorData: {
    name: string;
    cpfCnpj: string;
    phone: string;
    email: string;
    storeId: string;
  }) => {
    try {
      const { error } = await supabase
        .from("vendors")
        .insert({
          name: vendorData.name,
          cpf_cnpj: vendorData.cpfCnpj,
          phone: vendorData.phone,
          email: vendorData.email,
          store_id: vendorData.storeId,
          receipts_submitted: 0,
          receipts_rejected: 0,
          monthly_sales: 0,
        });

      if (error) throw error;

      await fetchVendors();
      
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
      <VendorsList vendors={vendors} />
    </div>
  );
}
