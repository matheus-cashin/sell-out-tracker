import { Package, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface ProductsHeaderProps {
  totalProducts: number;
  inactiveProducts: number;
  onAddProduct: () => void;
}

export function ProductsHeader({ totalProducts, inactiveProducts, onAddProduct }: ProductsHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground mt-1">Gerencie o catálogo de produtos</p>
        </div>
        <Button onClick={onAddProduct} size="lg">
          Incluir Produto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Total de Produtos"
          value={totalProducts.toString()}
          icon={Package}
        />
        <StatsCard
          title="Produtos Desativados"
          value={inactiveProducts.toString()}
          icon={PackageX}
          trend={{ value: "0", positive: true }}
        />
      </div>
    </div>
  );
}
