import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
interface AppLayoutProps {
  children: React.ReactNode;
}
export function AppLayout({
  children
}: AppLayoutProps) {
  return <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="text-sm font-semibold text-primary">Cashin Tracker</div>
          </header>
          <main className="flex-1 p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
}