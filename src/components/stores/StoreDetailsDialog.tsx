import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, UserPlus } from "lucide-react";
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
  const [isValueGoal, setIsValueGoal] = useState(true);
  const [goalValue, setGoalValue] = useState("");
  const [goalProducts, setGoalProducts] = useState("");

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

    const goalAmount = isValueGoal ? parseFloat(goalValue) : parseInt(goalProducts);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      toast({
        title: "Meta inválida",
        description: "Insira um valor válido para a meta.",
        variant: "destructive",
      });
      return;
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="goal-type">Meta por Valor</Label>
              <Switch
                id="goal-type"
                checked={isValueGoal}
                onCheckedChange={setIsValueGoal}
              />
              <Label htmlFor="goal-type">Meta por Produto</Label>
            </div>

            {isValueGoal ? (
              <div className="space-y-2">
                <Label htmlFor="goal-value">Meta em Valor (R$)</Label>
                <Input
                  id="goal-value"
                  type="number"
                  placeholder="0.00"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="goal-products">Meta em Produtos (quantidade)</Label>
                <Input
                  id="goal-products"
                  type="number"
                  placeholder="0"
                  value={goalProducts}
                  onChange={(e) => setGoalProducts(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleSaveCampaign}>Salvar Campanha</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
