import { Users, XCircle, TrendingUp, Upload } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";

interface VendorsHeaderProps {
  totalVendors: number;
  totalRejected: number;
  totalSales: number;
  onImportVendors: () => void;
}

export function VendorsHeader({ totalVendors, totalRejected, totalSales, onImportVendors }: VendorsHeaderProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onImportVendors} variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Importar Vendedores
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total de Vendedores"
          value={totalVendors.toString()}
          icon={Users}
        />
        <StatsCard
          title="Notas Reprovadas"
          value={totalRejected.toString()}
          icon={XCircle}
        />
        <StatsCard
          title="Vendas do Mês"
          value={formatCurrency(totalSales)}
          icon={TrendingUp}
          trend={{ value: "8", positive: true }}
        />
      </div>
    </div>
  );
}
