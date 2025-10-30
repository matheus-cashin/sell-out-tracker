import { useState, useEffect } from "react";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { ProductsList } from "@/components/products/ProductsList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  sector: string;
  image: string;
  active: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;

      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        sector: product.sector,
        image: product.image_url || "",
        active: product.active,
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

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
