import { Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StoreSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  storeName: string;
}

export function StoreSuccessDialog({ open, onOpenChange, storeId, storeName }: StoreSuccessDialogProps) {
  const navigate = useNavigate();

  const handleAddVendors = () => {
    onOpenChange(false);
    navigate("/vendors", { state: { openAddVendor: true, storeId, storeName } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <DialogTitle className="text-center">Loja cadastrada com sucesso!</DialogTitle>
          <DialogDescription className="text-center">
            A loja foi adicionada ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Concluir
          </Button>
          <Button variant="outline" onClick={handleAddVendors}>
            <Users className="h-4 w-4" />
            Cadastrar Vendedores
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
