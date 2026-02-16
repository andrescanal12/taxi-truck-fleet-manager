import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Route, FileText, FileSearch, FilePlus, Settings, Headphones, Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-6 py-6 border-b border-sidebar-border">
        <img src={logo} alt="Taxi Truck" className="h-12 w-auto" />
        <button onClick={() => setOpen(false)} className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-brand-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
