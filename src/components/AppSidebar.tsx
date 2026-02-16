import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  FileText,
  FileSearch,
  FilePlus,
  Settings,
  Headphones,
  Menu,
  X,
  Send,
  Navigation,
  Users,
  Calendar,
} from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { to: "/", label: "Inicio", icon: LayoutDashboard },
  { to: "/solicitar", label: "Solicitar", icon: Send },
  { to: "/seguimiento", label: "Seguimiento", icon: Navigation },
  { to: "/trabajadores", label: "Conductores", icon: Users },
  { to: "/rutas", label: "Rutas", icon: Route },
  { to: "/albaranes", label: "Albaranes", icon: FileText },
  { to: "/facturacion", label: "Facturación", icon: Calendar },
  { to: "/facturas", label: "Facturas", icon: FilePlus },
  { to: "/extractor", label: "Extractor", icon: FileSearch },
  { to: "/ajustes", label: "Ajustes", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="relative border-b border-gray-200 overflow-hidden bg-white">

        {/* Logo container with professional styling */}
        <div className="relative flex items-center justify-center py-12">
          <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 rounded-2xl blur-xl transition-all duration-500" />

            {/* Logo */}
            <img
              src={logo}
              alt="Taxi Truck"
              className="h-28 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
        {/* Main section */}
        <p className="px-4 pt-2 pb-1 text-[10px] font-heading font-bold uppercase tracking-widest text-sidebar-foreground/40">
          Servicios
        </p>
        {navItems.slice(0, 4).map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-heading font-bold uppercase tracking-wide transition-all ${isActive
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          );
        })}

        {/* Operations section */}
        <p className="px-4 pt-4 pb-1 text-[10px] font-heading font-bold uppercase tracking-widest text-sidebar-foreground/40">
          Operaciones
        </p>
        {navItems.slice(4, 8).map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-heading font-bold uppercase tracking-wide transition-all ${isActive
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          );
        })}

        {/* System section */}
        <p className="px-4 pt-4 pb-1 text-[10px] font-heading font-bold uppercase tracking-widest text-sidebar-foreground/40">
          Sistema
        </p>
        {navItems.slice(8).map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-heading font-bold uppercase tracking-wide transition-all ${isActive
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
