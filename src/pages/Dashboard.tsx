import { TrendingUp, DollarSign, Package, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ValidationPanel } from "@/components/dashboard/ValidationPanel";
import { ProductPerformanceList } from "@/components/dashboard/ProductPerformanceList";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das vendas e validações
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Vendas Totais"
          value="213"
          description="Total de vendas registradas"
          icon={Package}
          trend={{ value: "+12% vs mês anterior", positive: true }}
        />
        <StatsCard
          title="Valor Total"
          value="R$ 58.200"
          description="Soma de todas as vendas"
          icon={DollarSign}
          trend={{ value: "+8.5% vs mês anterior", positive: true }}
        />
        <StatsCard
          title="Ticket Médio"
          value="R$ 273,24"
          description="Valor médio por venda"
          icon={TrendingUp}
          trend={{ value: "-2.3% vs mês anterior", positive: false }}
        />
        <StatsCard
          title="Pendentes"
          value="4"
          description="Validações aguardando"
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <SalesChart />
        <RevenueChart />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <ProductPerformanceList />
        <ValidationPanel />
      </div>
    </div>
  );
}
