import { useState } from "react";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { ProductsList } from "@/components/products/ProductsList";

// Mock data - será substituído por dados reais do backend
const mockProducts = Array.from({ length: 45 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: `Produto ${i + 1}`,
  description: `Descrição do produto ${i + 1}`,
  sector: ["Medicamentos", "Suplementos", "Veterinário"][i % 3],
  image: "/placeholder.svg",
  active: i % 5 !== 0,
}));

export default function Products() {
  const [products] = useState(mockProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalProducts = products.length;
  const inactiveProducts = products.filter(p => !p.active).length;

  return (
    <div className="space-y-6">
      <ProductsHeader
        totalProducts={totalProducts}
        inactiveProducts={inactiveProducts}
        onAddProduct={() => setIsAddDialogOpen(true)}
      />
      
      <ProductsList products={products} />
      
      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
