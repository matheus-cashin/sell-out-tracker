import { useState } from "react";
import { Plus } from "lucide-react";
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
import { StoreSuccessDialog } from "./StoreSuccessDialog";

interface AddStoreDialogProps {
  onAddStore: (store: {
    name: string;
    region: string;
    address: string;
  }) => string;
}

export function AddStoreDialog({ onAddStore }: AddStoreDialogProps) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastAddedStore, setLastAddedStore] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !region || !address) {
      return;
    }

    const storeData = {
      name,
      region,
      address,
    };

    const newStoreId = onAddStore(storeData);
    setLastAddedStore({ id: newStoreId, name });

    setName("");
    setRegion("");
    setAddress("");
    setOpen(false);
    setSuccessOpen(true);
  };

  return (
    <>
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
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Rua, número - Cidade, Estado"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Cadastrar Loja
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {lastAddedStore && (
      <StoreSuccessDialog 
        open={successOpen} 
        onOpenChange={setSuccessOpen}
        storeId={lastAddedStore.id}
        storeName={lastAddedStore.name}
      />
    )}
    </>
  );
}
