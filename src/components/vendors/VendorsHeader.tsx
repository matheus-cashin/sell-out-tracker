import { Users, XCircle, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface VendorsHeaderProps {
  totalVendors: number;
  totalRejected: number;
  totalSales: number;
}

export function VendorsHeader({ totalVendors, totalRejected, totalSales }: VendorsHeaderProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
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
  );
}
