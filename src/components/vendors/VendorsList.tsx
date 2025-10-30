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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VendorDetailsDialog } from "./VendorDetailsDialog";
import { Vendor } from "@/pages/Vendors";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface VendorsListProps {
  vendors: Vendor[];
}

const ITEMS_PER_PAGE = 10;

type SortField = "name" | "store" | "receiptsSubmitted" | "receiptsRejected" | "monthlySales";
type SortDirection = "asc" | "desc";

export function VendorsList({ vendors }: VendorsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Get unique stores for filter
  const uniqueStores = Array.from(new Set(vendors.map(v => v.store))).sort();

  // Filter vendors by store
  const filteredVendors = storeFilter === "all" 
    ? vendors 
    : vendors.filter(v => v.store === storeFilter);

  // Sort vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedVendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVendors = sortedVendors.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Select value={storeFilter} onValueChange={(value) => {
            setStoreFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por loja" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as lojas</SelectItem>
              {uniqueStores.map((store) => (
                <SelectItem key={store} value={store}>
                  {store}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground">
          {sortedVendors.length} vendedor{sortedVendors.length !== 1 ? "es" : ""}
        </span>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead 
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nome
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("store")}
              >
                <div className="flex items-center">
                  Loja
                  {getSortIcon("store")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("receiptsSubmitted")}
              >
                <div className="flex items-center">
                  Notas Enviadas
                  {getSortIcon("receiptsSubmitted")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("receiptsRejected")}
              >
                <div className="flex items-center">
                  Notas Reprovadas
                  {getSortIcon("receiptsRejected")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("monthlySales")}
              >
                <div className="flex items-center">
                  Vendas do Mês
                  {getSortIcon("monthlySales")}
                </div>
              </TableHead>
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
