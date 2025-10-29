import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vendor } from "@/pages/Vendors";

interface VendorDetailsDialogProps {
  vendor: Vendor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorDetailsDialog({ vendor, open, onOpenChange }: VendorDetailsDialogProps) {
  const [selectedMonth, setSelectedMonth] = useState("2024-01");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Dados mockados para demonstração
  const monthlyData = {
    receiptsSubmitted: vendor.receiptsSubmitted,
    receiptsApproved: vendor.receiptsSubmitted - vendor.receiptsRejected,
    receiptsRejected: vendor.receiptsRejected,
    totalSales: vendor.monthlySales,
  };

  const topProducts = [
    { name: "Produto A", quantity: 45, sales: 8900 },
    { name: "Produto B", quantity: 32, sales: 6400 },
    { name: "Produto C", quantity: 28, sales: 5600 },
    { name: "Produto D", quantity: 19, sales: 3800 },
    { name: "Produto E", quantity: 15, sales: 3000 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{vendor.name}</span>
            <Badge variant="outline">{vendor.id}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">Janeiro 2024</SelectItem>
                  <SelectItem value="2023-12">Dezembro 2023</SelectItem>
                  <SelectItem value="2023-11">Novembro 2023</SelectItem>
                  <SelectItem value="2023-10">Outubro 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Loja: <span className="font-medium text-foreground">{vendor.store}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Notas Enviadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyData.receiptsSubmitted}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Aprovadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{monthlyData.receiptsApproved}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Reprovadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{monthlyData.receiptsRejected}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyData.totalSales)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Produtos Vendidos</TabsTrigger>
              <TabsTrigger value="receipts">Histórico de Notas</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.sales)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="receipts" className="space-y-4">
              <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
                <p>Histórico de notas em desenvolvimento</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
