import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { VendorDetailsDialog } from "./VendorDetailsDialog";
import { Vendor } from "@/pages/Vendors";

interface VendorsListProps {
  vendors: Vendor[];
}

const ITEMS_PER_PAGE = 10;

export function VendorsList({ vendors }: VendorsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVendors = vendors.slice(startIndex, endIndex);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Loja</TableHead>
              <TableHead>Notas Enviadas</TableHead>
              <TableHead>Notas Reprovadas</TableHead>
              <TableHead>Vendas do Mês</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVendors.map((vendor) => (
              <TableRow 
                key={vendor.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedVendor(vendor)}
              >
                <TableCell className="font-medium">{vendor.id}</TableCell>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.store}</TableCell>
                <TableCell>{vendor.receiptsSubmitted}</TableCell>
                <TableCell>
                  <span className={vendor.receiptsRejected > 3 ? "text-destructive font-medium" : ""}>
                    {vendor.receiptsRejected}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(vendor.monthlySales)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {selectedVendor && (
        <VendorDetailsDialog
          vendor={selectedVendor}
          open={!!selectedVendor}
          onOpenChange={(open) => !open && setSelectedVendor(null)}
        />
      )}
    </div>
  );
}
