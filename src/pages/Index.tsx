import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  FilePlus,
  FileSearch,
  Route,
  TrendingUp,
  Truck,
  Clock,
  Euro,
  MapPin,
  Package,
  Users,
  Navigation,
  Send,
  Radio,
  CheckCircle2,
  ArrowRight,
  Bell,
  Star,
  Calendar,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useServicios } from "@/contexts/ServiciosContext";

const Index = () => {
  const {
    servicios,
    trabajadores,
    serviciosPendientes,
    serviciosActivos,
    serviciosCompletados,
    trabajadoresDisponibles,
    configFacturacion,
  } = useServicios();

  const totalIngresos = serviciosCompletados.reduce(
    (sum, s) => sum + (s.costoFinal || s.costoEstimado || 0),
    0
  );

  const stats = [
    {
      label: "Servicios Activos",
      value: String(serviciosActivos.length),
      change: serviciosPendientes.length > 0 ? `+${serviciosPendientes.length} pendientes` : undefined,
      icon: Truck,
      variant: "default" as const,
    },
    {
      label: "Conductores",
      value: `${trabajadoresDisponibles.length}/${trabajadores.length}`,
      sub: "Disponibles",
      icon: Users,
      variant: "default" as const,
    },
    {
      label: "Completados",
      value: String(serviciosCompletados.length),
      sub: "Este periodo",
      icon: CheckCircle2,
      variant: "default" as const,
    },
    {
      label: "Ingresos Periodo",
      value: `€${totalIngresos > 1000 ? `${(totalIngresos / 1000).toFixed(1)}K` : totalIngresos}`,
      icon: Euro,
      variant: "highlight" as const,
    },
  ];

  const quickActions = [
    {
      label: "Solicitar Servicio",
      sub: "Nuevo transporte de mercancía",
      icon: Send,
      to: "/solicitar",
      variant: "highlight" as const,
    },
    {
      label: "Seguimiento GPS",
      sub: "Rastreo en tiempo real",
      icon: Navigation,
      to: "/seguimiento",
      variant: "default" as const,
    },
    {
      label: "Panel Conductores",
      sub: "Gestión de trabajadores",
      icon: Users,
      to: "/trabajadores",
      variant: "default" as const,
    },
    {
      label: "Facturación Auto",
      sub: "Liquidación periódica",
      icon: Calendar,
      to: "/facturacion",
      variant: "default" as const,
    },
  ];

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
            className={`rounded-xl border p-5 ${stat.variant === "highlight"
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-card text-card-foreground border-border"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-heading font-bold uppercase tracking-wider ${stat.variant === "highlight" ? "text-secondary-foreground/70" : "text-muted-foreground"
                  }`}
              >
                {stat.label}
              </span>
              <stat.icon
                className={`h-4 w-4 ${stat.variant === "highlight" ? "text-primary" : "text-muted-foreground"
                  }`}
              />
            </div>
            <p className="text-3xl font-heading font-extrabold">{stat.value}</p>
            {stat.change && <span className="text-xs text-brand-warning font-semibold">{stat.change}</span>}
            {stat.sub && (
              <span
                className={`text-xs ${stat.variant === "highlight" ? "text-secondary-foreground/60" : "text-muted-foreground"
                  }`}
              >
                {stat.sub}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight mb-4 flex items-center gap-2">
          <span className="text-brand-yellow">⚡</span> Acceso Rápido
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link
                to={action.to}
                className={`group flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1 ${action.variant === "highlight"
                    ? "bg-primary text-primary-foreground border-primary hover:bg-brand-yellow-hover"
                    : "bg-card text-card-foreground border-border hover:border-primary"
                  }`}
              >
                <action.icon
                  className={`h-8 w-8 ${action.variant === "highlight"
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-primary"
                    }`}
                />
                <div>
                  <p className="font-heading font-extrabold uppercase text-base">{action.label}</p>
                  <p
                    className={`text-xs mt-1 ${action.variant === "highlight" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                  >
                    {action.sub}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Active services + Pending alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Services */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight flex items-center gap-2">
              <Radio className="h-5 w-5 text-brand-success" />
              Servicios en Curso
            </h2>
            <Link to="/seguimiento" className="text-sm font-heading font-bold uppercase text-brand-yellow hover:underline">
              Ver Seguimiento
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {serviciosActivos.length > 0 ? (
              <div className="divide-y divide-border">
                {serviciosActivos.map((s) => (
                  <div key={s.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-heading font-extrabold">{s.id}</span>
                          <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full bg-brand-info/10 text-brand-info">
                            {s.estado.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{s.origen.split(",")[0]}</span>
                          <ArrowRight className="h-3 w-3 text-primary" />
                          <span className="truncate max-w-[120px] text-foreground font-bold">
                            {s.destino.split(",")[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {s.trabajadorNombre && (
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                              {s.trabajadorNombre.charAt(0)}
                            </div>
                            <span className="text-xs font-bold">{s.trabajadorNombre.split(" ")[0]}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${s.progreso}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold w-8 text-right">{s.progreso}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Truck className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-heading font-bold">Sin servicios activos</p>
                <Link to="/solicitar" className="text-xs text-primary hover:underline">
                  Crear nueva solicitud
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Pending notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-warning" />
              Pendientes
            </h2>
            <Link to="/trabajadores" className="text-sm font-heading font-bold uppercase text-brand-yellow hover:underline">
              Gestionar
            </Link>
          </div>
          <div className="space-y-3">
            {serviciosPendientes.length > 0 ? (
              serviciosPendientes.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-brand-warning/30 bg-brand-warning/5 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-brand-warning" />
                    <span className="text-sm font-heading font-extrabold">{s.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.clienteNombre}</p>
                  <p className="text-xs text-foreground font-bold truncate mt-1">
                    {s.tipoCarga.replace("_", " ")}
                  </p>
                  {s.costoEstimado && (
                    <p className="text-sm font-heading font-extrabold text-primary mt-1">
                      €{s.costoEstimado}
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-brand-success" />
                <p className="text-xs font-heading font-bold">Todo asignado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drivers overview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight">Estado de la Flota</h2>
          <Link to="/trabajadores" className="text-sm font-heading font-bold uppercase text-brand-yellow hover:underline">
            Ver Todos
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {trabajadores.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <div className="relative inline-block mb-2">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-heading font-bold text-secondary-foreground mx-auto">
                  {t.nombre.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${t.estado === "disponible"
                      ? "bg-brand-success"
                      : t.estado === "en_servicio"
                        ? "bg-brand-warning"
                        : "bg-muted-foreground"
                    }`}
                />
              </div>
              <p className="text-xs font-heading font-bold truncate">{t.nombre.split(" ")[0]}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="h-3 w-3 text-primary fill-primary" />
                <span className="text-[10px] font-bold">{t.valoracion}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflow visualization */}
      <section>
        <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight mb-4">
          Flujo de Trabajo
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {[
              { icon: Send, label: "Cliente Solicita", color: "text-primary" },
              { icon: Bell, label: "Notificación", color: "text-brand-warning" },
              { icon: Truck, label: "Conductor Acepta", color: "text-brand-info" },
              { icon: Navigation, label: "Ruta GPS", color: "text-brand-info" },
              { icon: Radio, label: "Seguimiento", color: "text-brand-success" },
              { icon: FileText, label: "Albarán + Foto", color: "text-foreground" },
              { icon: Euro, label: "Costo Auto", color: "text-primary" },
              { icon: Calendar, label: "Facturación", color: "text-brand-success" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                  <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${step.color}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-heading font-bold uppercase text-center leading-tight">
                    {step.label}
                  </span>
                </div>
                {i < 7 && <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Index;
