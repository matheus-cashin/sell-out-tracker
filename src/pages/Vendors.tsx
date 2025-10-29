import { useState } from "react";
import { VendorsHeader } from "@/components/vendors/VendorsHeader";
import { VendorsList } from "@/components/vendors/VendorsList";

export interface Vendor {
  id: string;
  name: string;
  store: string;
  receiptsSubmitted: number;
  receiptsRejected: number;
  monthlySales: number;
}

export default function Vendors() {
  const [vendors] = useState<Vendor[]>([
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendedores</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho dos vendedores
          </p>
        </div>
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
