import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddStoreDialogProps {
  onAddStore: (store: {
    name: string;
    region: string;
    monthlyRevenue: number;
    address: string;
  }) => void;
}

export function AddStoreDialog({ onAddStore }: AddStoreDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [revenue, setRevenue] = useState("");
  const [address, setAddress] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !region || !revenue || !address) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    onAddStore({
      name,
      region,
      monthlyRevenue: parseFloat(revenue),
      address,
    });

    toast({
      title: "Loja cadastrada",
      description: "A loja foi adicionada com sucesso.",
    });

    setName("");
    setRegion("");
    setRevenue("");
    setAddress("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Adicionar Loja
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Loja</DialogTitle>
          <DialogDescription>
            Preencha as informações da loja abaixo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input
              id="name"
              placeholder="Ex: Loja Centro"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Região</Label>
            <Input
              id="region"
              placeholder="Ex: Centro, Norte, Sul"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue">Faturamento Mensal (R$)</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="Ex: 125000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Rua, número - Cidade, Estado"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button type="submit" className="w-full">
              Cadastrar Loja
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled
            >
              <Users className="h-4 w-4" />
              Incluir Vendedores
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
