import { Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ImportVendorsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportVendorsDialog({ open, onOpenChange }: ImportVendorsDialogProps) {
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Arquivo carregado",
        description: `${file.name} será processado.`,
      });
    }
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Download iniciado",
      description: "O template será baixado em breve.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Vendedores</DialogTitle>
          <DialogDescription>
            Faça upload de uma planilha para adicionar vários vendedores de uma vez
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Arraste e solte sua planilha aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: .xlsx, .xls, .csv
              </p>
            </div>
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="max-w-xs mx-auto"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}