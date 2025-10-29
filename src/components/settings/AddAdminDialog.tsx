import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddAdminDialogProps {
  onAdminAdded: () => void;
}

export function AddAdminDialog({ onAdminAdded }: AddAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [canValidateReceipts, setCanValidateReceipts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For now, we'll use the email as user_id
      // In a real scenario, you would look up the user by email first
      // or create a new user account
      
      // Insert into user_roles
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: email, // This should be the actual user UUID
          role: "admin",
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (roleError) {
        if (roleError.code === "23505") { // Unique constraint violation
          throw new Error("Este usuário já é um administrador.");
        }
        throw roleError;
      }

      // Insert into admin_permissions
      const { error: permError } = await supabase
        .from("admin_permissions")
        .insert({
          user_id: email,
          can_validate_receipts: canValidateReceipts,
        });

      if (permError) throw permError;

      toast({
        title: "Administrador adicionado",
        description: "O novo administrador foi cadastrado com sucesso.",
      });

      setOpen(false);
      setEmail("");
      setCanValidateReceipts(true);
      onAdminAdded();
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast({
        title: "Erro ao adicionar administrador",
        description: error.message || "Ocorreu um erro ao cadastrar o administrador.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Administrador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Administrador</DialogTitle>
            <DialogDescription>
              Cadastre um novo administrador para o sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email do usuário</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="validate"
                checked={canValidateReceipts}
                onCheckedChange={(checked) =>
                  setCanValidateReceipts(checked as boolean)
                }
                disabled={isLoading}
              />
              <Label
                htmlFor="validate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Permitir validar notas fiscais
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
