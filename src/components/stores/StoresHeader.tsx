import { Store, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface StoresHeaderProps {
  totalStores: number;
}

export function StoresHeader({ totalStores }: StoresHeaderProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total de Lojas"
        value={totalStores.toString()}
        icon={Store}
      />
      <StatsCard
        title="Faturamento Total"
        value="R$ 379.000"
        icon={TrendingUp}
        trend={{ value: "12", positive: true }}
      />
    </div>
  );
}
