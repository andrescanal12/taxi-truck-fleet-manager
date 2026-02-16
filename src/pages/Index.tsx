import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, FilePlus, FileSearch, Route, TrendingUp, Truck, Clock, Euro } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const stats = [
  { label: "Entregas Hoy", value: "142", change: "+12%", icon: Truck, variant: "default" as const },
  { label: "Estado de Flota", value: "89%", sub: "Activa", icon: TrendingUp, variant: "default" as const },
  { label: "En Tránsito", value: "34", sub: "Vehículos", icon: Clock, variant: "default" as const },
  { label: "Ingresos Mes", value: "€84.2K", icon: Euro, variant: "highlight" as const },
];

const quickActions = [
  { label: "Crear Albarán", sub: "Nuevo envío rápido", icon: FileText, to: "/albaranes", variant: "default" as const },
  { label: "Generar Factura", sub: "Liquidación de servicios", icon: FilePlus, to: "/facturas", variant: "highlight" as const },
  { label: "Escanear Factura", sub: "Procesamiento OCR", icon: FileSearch, to: "/extractor", variant: "default" as const },
];

const activeRoutes = [
  { id: "RTX-9024", from: "Madrid", to: "Barcelona", progress: 75, eta: "14:30" },
  { id: "RTX-9031", from: "Valencia", to: "Sevilla", progress: 52, eta: "18:15" },
  { id: "RTX-8992", from: "Bilbao", to: "Zaragoza", progress: 10, eta: "09:45" },
];

const Index = () => {
  return (
    <AppLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border p-5 ${
              stat.variant === "highlight"
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-card text-card-foreground border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-heading font-bold uppercase tracking-wider ${
                stat.variant === "highlight" ? "text-secondary-foreground/70" : "text-muted-foreground"
              }`}>
                {stat.label}
              </span>
              <stat.icon className={`h-4 w-4 ${
                stat.variant === "highlight" ? "text-primary" : "text-muted-foreground"
              }`} />
            </div>
            <p className="text-3xl font-heading font-extrabold">{stat.value}</p>
            {stat.change && (
              <span className="text-xs text-brand-success font-semibold">{stat.change}</span>
            )}
            {stat.sub && (
              <span className={`text-xs ${stat.variant === "highlight" ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>{stat.sub}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight mb-4 flex items-center gap-2">
          <span className="text-brand-yellow">⚡</span> Acceso Rápido
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link
                to={action.to}
                className={`group flex flex-col items-center gap-3 rounded-xl border p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1 ${
                  action.variant === "highlight"
                    ? "bg-primary text-primary-foreground border-primary hover:bg-brand-yellow-hover"
                    : "bg-card text-card-foreground border-border hover:border-primary"
                }`}
              >
                <action.icon className={`h-8 w-8 ${
                  action.variant === "highlight" ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                }`} />
                <div>
                  <p className="font-heading font-extrabold uppercase text-lg">{action.label}</p>
                  <p className={`text-xs mt-1 ${
                    action.variant === "highlight" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>{action.sub}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Active Routes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight">Rutas Activas</h2>
          <Link to="/rutas" className="text-sm font-heading font-bold uppercase text-brand-yellow hover:underline">
            Ver Todas
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-heading font-bold uppercase text-xs text-muted-foreground tracking-wider">Expedición</th>
                <th className="px-5 py-3 text-left font-heading font-bold uppercase text-xs text-muted-foreground tracking-wider">Ruta / Destino</th>
                <th className="px-5 py-3 text-left font-heading font-bold uppercase text-xs text-muted-foreground tracking-wider">Progreso</th>
                <th className="px-5 py-3 text-left font-heading font-bold uppercase text-xs text-muted-foreground tracking-wider">ETA</th>
              </tr>
            </thead>
            <tbody>
              {activeRoutes.map((route) => (
                <tr key={route.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 font-heading font-bold text-foreground">{route.id}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">{route.from}</span>
                      <Route className="h-3 w-3 text-muted-foreground" />
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">{route.to}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${route.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold">{route.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-heading font-bold text-foreground">{route.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
};

export default Index;
