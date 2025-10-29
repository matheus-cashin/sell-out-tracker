import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Category = "all" | "A" | "B" | "C";

interface Product {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  category: "A" | "B" | "C";
}

const products: Product[] = [
  { id: "1", name: "Produto Premium Alpha", quantity: 145, revenue: 43500, category: "A" },
  { id: "2", name: "Produto Elite Beta", quantity: 132, revenue: 39600, category: "A" },
  { id: "3", name: "Produto Standard Gamma", quantity: 98, revenue: 19600, category: "B" },
  { id: "4", name: "Produto Plus Delta", quantity: 87, revenue: 17400, category: "B" },
  { id: "5", name: "Produto Basic Epsilon", quantity: 56, revenue: 8400, category: "C" },
  { id: "6", name: "Produto Entry Zeta", quantity: 43, revenue: 6450, category: "C" },
  { id: "7", name: "Produto Starter Eta", quantity: 34, revenue: 5100, category: "C" },
];

export function ProductPerformanceList() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const getCategoryColor = (category: "A" | "B" | "C") => {
    switch (category) {
      case "A": return "bg-primary text-primary-foreground";
      case "B": return "bg-accent text-accent-foreground";
      case "C": return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance de Produtos</CardTitle>
            <CardDescription>
              Produtos ordenados por volume de saída e faturamento
            </CardDescription>
          </div>
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="A">Categoria A</TabsTrigger>
              <TabsTrigger value="B">Categoria B</TabsTrigger>
              <TabsTrigger value="C">Categoria C</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <Badge className={getCategoryColor(product.category)}>
                  {product.category}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.quantity} unidades vendidas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.revenue)}
                </p>
                <p className="text-sm text-muted-foreground">faturamento</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
