import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { region: "Sul", vendas: 45 },
  { region: "Norte", vendas: 32 },
  { region: "Sudeste", vendas: 67 },
  { region: "Centro-Oeste", vendas: 28 },
  { region: "Nordeste", vendas: 41 },
];

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume de Vendas</CardTitle>
        <CardDescription>
          Quantidade de vendas por região nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="region" className="text-xs" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar dataKey="vendas" fill="hsl(var(--primary))" name="Vendas" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
