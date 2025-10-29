import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Admin {
  id: string;
  user_id: string;
  email: string;
  can_validate_receipts: boolean;
  created_at: string;
}

interface AdminsListProps {
  admins: Admin[];
  isLoading: boolean;
  onRemoveAdmin: (userId: string) => void;
}

export function AdminsList({ admins, isLoading, onRemoveAdmin }: AdminsListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando administradores...</p>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum administrador cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email / ID</TableHead>
          <TableHead>Validar Notas</TableHead>
          <TableHead>Data de Cadastro</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="font-medium">{admin.email}</TableCell>
            <TableCell>
              {admin.can_validate_receipts ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Sim
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Não
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {new Date(admin.created_at).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover Administrador</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover este administrador? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemoveAdmin(admin.user_id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
