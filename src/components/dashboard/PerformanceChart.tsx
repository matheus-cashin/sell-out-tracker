import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { region: "Sul", vendas: 45, valor: 12500 },
  { region: "Norte", vendas: 32, valor: 8900 },
  { region: "Sudeste", vendas: 67, valor: 18400 },
  { region: "Centro-Oeste", vendas: 28, valor: 7200 },
  { region: "Nordeste", vendas: 41, valor: 11300 },
];

export function PerformanceChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Performance por Região</CardTitle>
        <CardDescription>
          Volume de vendas e valor por região nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="region" className="text-xs" />
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="vendas" fill="hsl(var(--primary))" name="Vendas" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="valor" fill="hsl(var(--accent))" name="Valor (R$)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
