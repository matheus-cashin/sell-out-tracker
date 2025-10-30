import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Search,
  Eye,
  CalendarIcon,
  Store,
  User,
  DollarSign
} from "lucide-react";

interface ValidationItem {
  id: string;
  receiptId: string;
  vendedor: string;
  loja: string;
  valor: string;
  data: string;
  status: "pending" | "approved" | "rejected";
  imageUrl?: string;
  produtos: number;
  tempoEspera: string;
  observation?: string;
  rejectionReason?: string;
}

export default function Validations() {
  const [validations, setValidations] = useState<ValidationItem[]>([]);
  const [selectedValidation, setSelectedValidation] = useState<ValidationItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [observation, setObservation] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchValidations();
  }, []);

  const fetchValidations = async () => {
    try {
      const { data, error } = await supabase
        .from("receipts")
        .select(`
          *,
          stores (name),
          vendors (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedValidations: ValidationItem[] = data.map((receipt) => ({
        id: receipt.id,
        receiptId: receipt.receipt_number,
        vendedor: receipt.vendors?.name || "Desconhecido",
        loja: receipt.stores?.name || "Desconhecida",
        valor: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(receipt.total_value)),
        data: receipt.receipt_date,
        status: receipt.status as "pending" | "approved" | "rejected",
        imageUrl: receipt.image_url || undefined,
        produtos: receipt.products_count || 0,
        tempoEspera: calculateWaitTime(receipt.created_at),
        observation: receipt.observation || undefined,
        rejectionReason: receipt.rejection_reason || undefined,
      }));

      setValidations(formattedValidations);
    } catch (error) {
      console.error("Error fetching validations:", error);
      toast({
        title: "Erro ao carregar validações",
        description: "Não foi possível carregar as validações.",
        variant: "destructive",
      });
    }
  };

  const calculateWaitTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return "agora";
  };

  const stats = {
    pending: validations.filter((v) => v.status === "pending").length,
    approved: validations.filter((v) => v.status === "approved").length,
    rejected: validations.filter((v) => v.status === "rejected").length,
    avgTime: "45min",
  };

  const filteredValidations = validations.filter((v) => {
    const matchesTab = activeTab === "all" || v.status === activeTab;
    const matchesSearch =
      v.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.loja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.receiptId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleView = (validation: ValidationItem) => {
    setSelectedValidation(validation);
    setObservation(validation.observation || "");
    setRejectionReason(validation.rejectionReason || "");
    setDialogOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("receipts")
        .update({ 
          status: "approved",
          validated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      await fetchValidations();
      setDialogOpen(false);
      toast({
        title: "Validação aprovada",
        description: "A validação foi aprovada com sucesso.",
      });
    } catch (error) {
      console.error("Error approving validation:", error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar a validação.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da recusa.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("receipts")
        .update({ 
          status: "rejected",
          rejection_reason: rejectionReason,
          validated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      await fetchValidations();
      setDialogOpen(false);
      setRejectionReason("");
      toast({
        title: "Validação recusada",
        description: "A validação foi recusada.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error rejecting validation:", error);
      toast({
        title: "Erro ao recusar",
        description: "Não foi possível recusar a validação.",
        variant: "destructive",
      });
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from("receipts")
        .update({ 
          status: "approved",
          validated_at: new Date().toISOString()
        })
        .in("id", selectedIds);

      if (error) throw error;

      await fetchValidations();
      setSelectedIds([]);
      toast({
        title: "Validações aprovadas",
        description: `${selectedIds.length} validações foram aprovadas.`,
      });
    } catch (error) {
      console.error("Error bulk approving:", error);
      toast({
        title: "Erro ao aprovar em lote",
        description: "Não foi possível aprovar as validações.",
        variant: "destructive",
      });
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pendingIds = filteredValidations
      .filter(v => v.status === "pending")
      .map(v => v.id);
    setSelectedIds(prev => 
      prev.length === pendingIds.length ? [] : pendingIds
    );
  };

  const getStatusBadge = (status: ValidationItem["status"]) => {
    const variants = {
      pending: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-500" },
      approved: { label: "Aprovada", className: "bg-green-500/10 text-green-500" },
      rejected: { label: "Recusada", className: "bg-red-500/10 text-red-500" },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Validações Fiscais</h1>
        <p className="text-muted-foreground">
          Gerencie e valide notas fiscais enviadas pelos vendedores
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Aguardando validação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas (mês)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Validadas com sucesso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recusadas (mês)</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Não aprovadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTime}</div>
            <p className="text-xs text-muted-foreground">De validação</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por vendedor, loja ou nota fiscal..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {selectedIds.length > 0 && (
              <Button onClick={handleBulkApprove} size="sm">
                <CheckCircle2 className="h-4 w-4" />
                Aprovar Selecionadas ({selectedIds.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                Pendentes ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Aprovadas ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Recusadas ({stats.rejected})
              </TabsTrigger>
              <TabsTrigger value="all">Todas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {activeTab === "pending" && filteredValidations.filter(v => v.status === "pending").length > 0 && (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                  <Checkbox
                    checked={selectedIds.length === filteredValidations.filter(v => v.status === "pending").length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Selecionar todas pendentes
                  </span>
                </div>
              )}

              {filteredValidations.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma validação encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredValidations.map((validation) => (
                    <Card key={validation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {validation.status === "pending" && (
                            <Checkbox
                              checked={selectedIds.includes(validation.id)}
                              onCheckedChange={() => toggleSelection(validation.id)}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{validation.receiptId}</h3>
                                  {getStatusBadge(validation.status)}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {validation.vendedor}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Store className="h-3 w-3" />
                                    {validation.loja}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {validation.valor}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {new Date(validation.data).toLocaleDateString('pt-BR')}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {validation.status === "pending" && (
                                  <Badge variant="outline" className="whitespace-nowrap">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {validation.tempoEspera}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {validation.produtos} produtos
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleView(validation)}
                                >
                                  <Eye className="h-4 w-4" />
                                  Ver Detalhes
                                </Button>
                                {validation.status === "pending" && (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleApprove(validation.id)}
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      Aprovar
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedValidation(validation);
                                        setDialogOpen(true);
                                      }}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Recusar
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Validação</DialogTitle>
            <DialogDescription>
              Visualize os detalhes completos e tome uma ação
            </DialogDescription>
          </DialogHeader>
          {selectedValidation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nota Fiscal</Label>
                  <p className="font-semibold">{selectedValidation.receiptId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedValidation.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vendedor</Label>
                  <p className="font-semibold">{selectedValidation.vendedor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Loja</Label>
                  <p className="font-semibold">{selectedValidation.loja}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="font-semibold">
                    {new Date(selectedValidation.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Total</Label>
                  <p className="font-semibold">{selectedValidation.valor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Produtos</Label>
                  <p className="font-semibold">{selectedValidation.produtos}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tempo de Espera</Label>
                  <p className="font-semibold">{selectedValidation.tempoEspera}</p>
                </div>
              </div>

              {selectedValidation.imageUrl && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Imagem da Nota</Label>
                  <img 
                    src={selectedValidation.imageUrl} 
                    alt="Nota fiscal" 
                    className="w-full rounded-lg border"
                  />
                </div>
              )}

              {selectedValidation.observation && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="text-sm mt-1">{selectedValidation.observation}</p>
                </div>
              )}

              {selectedValidation.status === "rejected" && selectedValidation.rejectionReason && (
                <div>
                  <Label className="text-muted-foreground">Motivo da Recusa</Label>
                  <p className="text-sm mt-1 text-destructive">{selectedValidation.rejectionReason}</p>
                </div>
              )}

              {selectedValidation.status === "pending" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="observation">Observações (opcional)</Label>
                    <Textarea
                      id="observation"
                      placeholder="Adicione observações sobre esta validação..."
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rejection">Motivo da Recusa</Label>
                    <Textarea
                      id="rejection"
                      placeholder="Informe o motivo da recusa..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {selectedValidation?.status === "pending" && (
            <DialogFooter className="gap-2">
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
                <XCircle className="h-4 w-4" />
                Recusar
              </Button>
              <Button
                onClick={() => handleApprove(selectedValidation.id)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Aprovar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
