import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X, Eye } from "lucide-react";
import { toast } from "sonner";

interface ValidationItem {
  id: string;
  vendedor: string;
  loja: string;
  valor: string;
  data: string;
  imageUrl?: string;
}

const mockValidations: ValidationItem[] = [
  { id: "1", vendedor: "Maria Silva", loja: "Pet Shop Central", valor: "R$ 450,00", data: "28/10/2025" },
  { id: "2", vendedor: "João Santos", loja: "Mundo Pet", valor: "R$ 320,00", data: "28/10/2025" },
  { id: "3", vendedor: "Ana Costa", loja: "Bicho Feliz", valor: "R$ 580,00", data: "27/10/2025" },
  { id: "4", vendedor: "Carlos Souza", loja: "Pet Center", valor: "R$ 410,00", data: "27/10/2025" },
];

export function ValidationPanel() {
  const [validations, setValidations] = useState(mockValidations);
  const [selectedValidation, setSelectedValidation] = useState<ValidationItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleView = (validation: ValidationItem) => {
    setSelectedValidation(validation);
    setDialogOpen(true);
  };

  const handleApprove = (id: string) => {
    setValidations(validations.filter(v => v.id !== id));
    toast.success("Nota fiscal aprovada com sucesso!");
    setDialogOpen(false);
  };

  const handleReject = (id: string) => {
    setValidations(validations.filter(v => v.id !== id));
    toast.error("Nota fiscal recusada.");
    setDialogOpen(false);
  };

  return (
    <>
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Validações Pendentes</CardTitle>
              <CardDescription>
                Notas fiscais aguardando aprovação
              </CardDescription>
            </div>
            <Badge variant="warning">{validations.length} pendentes</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma validação pendente
              </div>
            ) : (
              validations.map((validation) => (
                <div
                  key={validation.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium">{validation.vendedor}</div>
                      <div className="text-xs text-muted-foreground">{validation.loja}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{validation.valor}</div>
                      <div className="text-xs text-muted-foreground">Valor</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{validation.data}</div>
                      <div className="text-xs text-muted-foreground">Data</div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(validation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(validation.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(validation.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Nota Fiscal</DialogTitle>
            <DialogDescription>
              Revise as informações antes de aprovar ou recusar
            </DialogDescription>
          </DialogHeader>
          {selectedValidation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Vendedor</div>
                  <div className="text-base font-medium">{selectedValidation.vendedor}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Loja</div>
                  <div className="text-base font-medium">{selectedValidation.loja}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Valor</div>
                  <div className="text-base font-medium">{selectedValidation.valor}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Data</div>
                  <div className="text-base font-medium">{selectedValidation.data}</div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="text-sm font-medium text-muted-foreground mb-2">Imagem da Nota Fiscal</div>
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">Imagem da nota fiscal</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedValidation.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Recusar
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleApprove(selectedValidation.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
