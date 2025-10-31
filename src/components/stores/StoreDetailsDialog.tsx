import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, UserPlus, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: string;
  name: string;
  region: string;
  monthlyRevenue: number;
  address: string;
}

interface StoreDetailsDialogProps {
  store: Store | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenVendorDialog: (storeId: string) => void;
}

export function StoreDetailsDialog({ store, open, onOpenChange, onOpenVendorDialog }: StoreDetailsDialogProps) {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [campaignStart, setCampaignStart] = useState<Date>();
  const [campaignEnd, setCampaignEnd] = useState<Date>();
  const [goalType, setGoalType] = useState<"value" | "product" | "vendor">("value");
  const [goalValue, setGoalValue] = useState("");
  
  // Product goal state
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [productGoals, setProductGoals] = useState<Record<string, number>>({});
  
  // Vendor goal state
  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorGoals, setVendorGoals] = useState<Record<string, number>>({});
  const [applyToAllValue, setApplyToAllValue] = useState("");

  useEffect(() => {
    if (open && goalType === "product") {
      fetchProducts();
    }
  }, [open, goalType]);

  useEffect(() => {
    if (open && goalType === "vendor" && store) {
      fetchVendors();
    }
  }, [open, goalType, store]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("name");
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchVendors = async () => {
    if (!store) return;
    
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("store_id", store.id)
        .order("name");
      
      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleApplyToAll = () => {
    const value = parseFloat(applyToAllValue);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Valor inválido",
        description: "Insira um valor válido.",
        variant: "destructive",
      });
      return;
    }

    const newGoals: Record<string, number> = {};
    vendors.forEach(vendor => {
      newGoals[vendor.id] = value;
    });
    setVendorGoals(newGoals);
    setApplyToAllValue("");
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSaveSettings = async () => {
    if (!store) return;

    try {
      const { error } = await supabase
        .from("stores")
        .update({ phone })
        .eq("id", store.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Telefone da loja atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCampaign = async () => {
    if (!store || !campaignStart || !campaignEnd) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o período da campanha.",
        variant: "destructive",
      });
      return;
    }

    // Validate based on goal type
    if (goalType === "value") {
      const value = parseFloat(goalValue);
      if (isNaN(value) || value <= 0) {
        toast({
          title: "Meta inválida",
          description: "Insira um valor válido para a meta.",
          variant: "destructive",
        });
        return;
      }
    } else if (goalType === "product") {
      const hasGoals = Object.values(productGoals).some(qty => qty > 0);
      if (!hasGoals) {
        toast({
          title: "Meta inválida",
          description: "Selecione pelo menos um produto com quantidade maior que zero.",
          variant: "destructive",
        });
        return;
      }
    } else if (goalType === "vendor") {
      const hasGoals = Object.values(vendorGoals).some(value => value > 0);
      if (!hasGoals) {
        toast({
          title: "Meta inválida",
          description: "Defina metas para pelo menos um vendedor.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // Here you would save the campaign data
      // For now, just show success message
      toast({
        title: "Campanha configurada",
        description: "A campanha foi salva com sucesso.",
      });
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Erro ao salvar campanha",
        description: "Não foi possível salvar a campanha.",
        variant: "destructive",
      });
    }
  };

  if (!store) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{store.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="campaign">Campanha</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenVendorDialog(store.id);
                  onOpenChange(false);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Vendedor
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="campaign" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campaignStart && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignStart ? format(campaignStart, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={campaignStart}
                      onSelect={setCampaignStart}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Término</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campaignEnd && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignEnd ? format(campaignEnd, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={campaignEnd}
                      onSelect={setCampaignEnd}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tipo de Meta</Label>
              <RadioGroup value={goalType} onValueChange={(value: any) => setGoalType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="value" id="value" />
                  <Label htmlFor="value" className="font-normal cursor-pointer">
                    Meta por Valor Total da Loja
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="product" id="product" />
                  <Label htmlFor="product" className="font-normal cursor-pointer">
                    Meta por Produto
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label htmlFor="vendor" className="font-normal cursor-pointer">
                    Meta por Vendedor
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {goalType === "value" && (
              <div className="space-y-2">
                <Label htmlFor="goal-value">
                  Valor Total da Meta (R$) - Valor esperado de vendas para toda a loja
                </Label>
                <Input
                  id="goal-value"
                  type="number"
                  placeholder="0.00"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                />
              </div>
            )}

            {goalType === "product" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="product-search">Buscar Produtos</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="product-search"
                      placeholder="Digite o nome do produto..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum produto encontrado
                    </p>
                  ) : (
                    <div className="divide-y">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="p-3 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sector}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`qty-${product.id}`} className="text-xs whitespace-nowrap">
                              Quantidade:
                            </Label>
                            <Input
                              id={`qty-${product.id}`}
                              type="number"
                              min="0"
                              placeholder="0"
                              value={productGoals[product.id] || ""}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setProductGoals(prev => ({
                                  ...prev,
                                  [product.id]: value
                                }));
                              }}
                              className="w-20"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {goalType === "vendor" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Valor para aplicar a todos"
                    value={applyToAllValue}
                    onChange={(e) => setApplyToAllValue(e.target.value)}
                  />
                  <Button onClick={handleApplyToAll} variant="outline">
                    Aplicar a Todos
                  </Button>
                </div>

                <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                  {vendors.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum vendedor cadastrado para esta loja
                    </p>
                  ) : (
                    <div className="divide-y">
                      {vendors.map((vendor) => (
                        <div key={vendor.id} className="p-3 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{vendor.name}</p>
                            <p className="text-xs text-muted-foreground">{vendor.phone || "Sem telefone"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`vendor-${vendor.id}`} className="text-xs whitespace-nowrap">
                              Meta (R$):
                            </Label>
                            <Input
                              id={`vendor-${vendor.id}`}
                              type="number"
                              min="0"
                              placeholder="0.00"
                              value={vendorGoals[vendor.id] || ""}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setVendorGoals(prev => ({
                                  ...prev,
                                  [vendor.id]: value
                                }));
                              }}
                              className="w-28"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button onClick={handleSaveCampaign} className="w-full">
              Salvar Campanha
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
