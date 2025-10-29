import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { region: "Sul", valor: 12500 },
  { region: "Norte", valor: 8900 },
  { region: "Sudeste", valor: 18400 },
  { region: "Centro-Oeste", valor: 7200 },
  { region: "Nordeste", valor: 11300 },
];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturamento</CardTitle>
        <CardDescription>
          Valor faturado por região nos últimos 30 dias
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
              formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <Legend />
            <Bar dataKey="valor" fill="hsl(var(--accent))" name="Valor (R$)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
