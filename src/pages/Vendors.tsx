import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { VendorsHeader } from "@/components/vendors/VendorsHeader";
import { VendorsList } from "@/components/vendors/VendorsList";
import { AddVendorDialog } from "@/components/vendors/AddVendorDialog";

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
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "V001",
      name: "João Silva",
      store: "Loja Centro",
      receiptsSubmitted: 45,
      receiptsRejected: 3,
      monthlySales: 28500,
    },
    {
      id: "V002",
      name: "Maria Santos",
      store: "Loja Zona Norte",
      receiptsSubmitted: 52,
      receiptsRejected: 1,
      monthlySales: 35200,
    },
    {
      id: "V003",
      name: "Pedro Costa",
      store: "Loja Zona Sul",
      receiptsSubmitted: 38,
      receiptsRejected: 5,
      monthlySales: 22100,
    },
    {
      id: "V004",
      name: "Ana Oliveira",
      store: "Loja Centro",
      receiptsSubmitted: 61,
      receiptsRejected: 2,
      monthlySales: 42300,
    },
  ]);

  const totalRejected = vendors.reduce((acc, v) => acc + v.receiptsRejected, 0);
  const totalSales = vendors.reduce((acc, v) => acc + v.monthlySales, 0);

  // Lojas disponíveis para vincular vendedores
  const stores = [
    { id: "LJ001", name: "Loja Centro" },
    { id: "LJ002", name: "Loja Zona Norte" },
    { id: "LJ003", name: "Loja Zona Sul" },
  ];

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

  const handleAddVendor = (vendorData: {
    name: string;
    cpfCnpj: string;
    phone: string;
    email: string;
    storeId: string;
  }) => {
    const store = stores.find((s) => s.id === vendorData.storeId);
    const newVendor: Vendor = {
      id: `V${String(vendors.length + 1).padStart(3, "0")}`,
      name: vendorData.name,
      store: store?.name || "",
      receiptsSubmitted: 0,
      receiptsRejected: 0,
      monthlySales: 0,
    };
    setVendors([...vendors, newVendor]);
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
