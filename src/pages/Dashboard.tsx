import { useState } from "react";
import { TrendingUp, DollarSign, Package, AlertCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ValidationPanel } from "@/components/dashboard/ValidationPanel";
import { ProductPerformanceList } from "@/components/dashboard/ProductPerformanceList";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const products = [
  { id: "all", name: "Todos os Produtos" },
  { id: "1", name: "Produto Premium Alpha" },
  { id: "2", name: "Produto Elite Beta" },
  { id: "3", name: "Produto Standard Gamma" },
  { id: "4", name: "Produto Plus Delta" },
  { id: "5", name: "Produto Basic Epsilon" },
  { id: "6", name: "Produto Entry Zeta" },
  { id: "7", name: "Produto Starter Eta" },
];

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedProduct, setSelectedProduct] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das vendas e validações
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
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
