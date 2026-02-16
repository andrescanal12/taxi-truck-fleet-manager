import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Route, FileText, FileSearch, FilePlus, Settings, Headphones } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { to: "/", label: "Inicio", icon: LayoutDashboard },
  { to: "/rutas", label: "Rutas", icon: Route },
  { to: "/albaranes", label: "Albaranes", icon: FileText },
  { to: "/facturas", label: "Facturas", icon: FilePlus },
  { to: "/extractor", label: "Extractor", icon: FileSearch },
  { to: "/ajustes", label: "Ajustes", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <img src={logo} alt="Taxi Truck" className="h-12 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-heading font-bold uppercase tracking-wide transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50 mb-3">
          <div className="h-2 w-2 rounded-full bg-brand-success" />
          <span>Servidores Activos</span>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-heading font-bold uppercase text-destructive-foreground transition-colors hover:bg-destructive/90">
          <Headphones className="h-4 w-4" />
          Soporte Flecha
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
