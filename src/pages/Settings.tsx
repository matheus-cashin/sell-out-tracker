import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAdminDialog } from "@/components/settings/AddAdminDialog";
import { AdminsList } from "@/components/settings/AdminsList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  user_id: string;
  email: string;
  role: string;
  can_validate_receipts: boolean;
  created_at: string;
}

export default function Settings() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all admin roles
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at")
        .eq("role", "admin");

      if (rolesError) throw rolesError;

      if (!adminRoles || adminRoles.length === 0) {
        setAdmins([]);
        return;
      }

      // Fetch permissions for these admins
      const { data: permissions, error: permissionsError } = await supabase
        .from("admin_permissions")
        .select("user_id, can_validate_receipts")
        .in("user_id", adminRoles.map(r => r.user_id));

      if (permissionsError) throw permissionsError;

      // Fetch user emails from auth.users (we'll need to get this info differently)
      // For now, we'll just show the user_id
      const adminsData: Admin[] = adminRoles.map(role => {
        const permission = permissions?.find(p => p.user_id === role.user_id);
        return {
          id: role.user_id,
          user_id: role.user_id,
          email: role.user_id, // We'll show user_id as email for now
          role: role.role,
          can_validate_receipts: permission?.can_validate_receipts ?? true,
          created_at: role.created_at,
        };
      });

      setAdmins(adminsData);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      toast({
        title: "Erro ao carregar administradores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdminAdded = () => {
    fetchAdmins();
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      // Remove from user_roles
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (roleError) throw roleError;

      // Remove from admin_permissions
      const { error: permError } = await supabase
        .from("admin_permissions")
        .delete()
        .eq("user_id", userId);

      if (permError) throw permError;

      toast({
        title: "Administrador removido",
        description: "O administrador foi removido com sucesso.",
      });

      fetchAdmins();
    } catch (error: any) {
      console.error("Error removing admin:", error);
      toast({
        title: "Erro ao remover administrador",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema e administradores
        </p>
      </div>

      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Administradores</CardTitle>
                  <CardDescription>
                    Adicione ou remova administradores do sistema
                  </CardDescription>
                </div>
                <AddAdminDialog onAdminAdded={handleAdminAdded} />
              </div>
            </CardHeader>
            <CardContent>
              <AdminsList
                admins={admins}
                isLoading={isLoading}
                onRemoveAdmin={handleRemoveAdmin}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Em breve: configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Outras configurações serão adicionadas aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
