import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import { Bell, Settings, Search } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-8 sm:py-4">
          <h1 className="text-lg sm:text-2xl font-heading font-extrabold uppercase tracking-tight text-foreground pl-12 lg:pl-0">
            {title}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar expedición..."
                className="h-10 rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="hidden sm:block rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-heading font-bold text-sm">
                TT
              </div>
              <div className="text-right">
                <p className="text-sm font-heading font-bold text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">Logistics Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
