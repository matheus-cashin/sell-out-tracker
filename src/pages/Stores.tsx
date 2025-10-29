import { useState } from "react";
import { StoresHeader } from "@/components/stores/StoresHeader";
import { AddStoreDialog } from "@/components/stores/AddStoreDialog";
import { StoresList } from "@/components/stores/StoresList";

interface Store {
  id: string;
  name: string;
  region: string;
  monthlyRevenue: number;
  address: string;
}

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([
    {
      id: "LJ001",
      name: "Loja Centro",
      region: "Centro",
      monthlyRevenue: 125000,
      address: "Av. Paulista, 1000 - São Paulo, SP",
    },
    {
      id: "LJ002",
      name: "Loja Zona Norte",
      region: "Norte",
      monthlyRevenue: 98000,
      address: "Rua das Flores, 500 - São Paulo, SP",
    },
    {
      id: "LJ003",
      name: "Loja Zona Sul",
      region: "Sul",
      monthlyRevenue: 156000,
      address: "Av. Ibirapuera, 2000 - São Paulo, SP",
    },
  ]);

  const handleAddStore = (store: Omit<Store, "id" | "monthlyRevenue">) => {
    const newStoreId = `LJ${String(stores.length + 1).padStart(3, "0")}`;
    const newStore = {
      ...store,
      id: newStoreId,
      monthlyRevenue: 0,
    };
    setStores([...stores, newStore]);
    return newStoreId;
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
      <StoresList stores={stores} />
    </div>
  );
}
