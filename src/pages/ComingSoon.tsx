import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function ComingSoon() {
  const location = useLocation();
  
  const pageTitles: Record<string, string> = {
    "/stores": "Lojas",
    "/vendors": "Vendedores",
    "/validations": "Validações",
    "/reports": "Relatórios",
    "/settings": "Configurações",
  };

  const pageTitle = pageTitles[location.pathname] || "Página";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Construction className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground max-w-md">
          Esta página está em desenvolvimento e estará disponível em breve.
        </p>
      </div>
    </div>
  );
}
