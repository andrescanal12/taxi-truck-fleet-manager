import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Euro,
    FileText,
    Send,
    Settings,
    TrendingUp,
    CheckCircle2,
    Package,
    ArrowRight,
    BarChart3,
    Download,
    AlertCircle,
    Timer,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useServicios } from "@/contexts/ServiciosContext";

const FacturacionAutoPage = () => {
    const { servicios, serviciosCompletados, configFacturacion, actualizarConfigFacturacion } = useServicios();

    const [periodoEditando, setPeriodoEditando] = useState(false);
    const [nuevoPeriodo, setNuevoPeriodo] = useState(String(configFacturacion.periodoMeses));

    // Calculations
    const totalFacturable = serviciosCompletados.reduce(
        (sum, s) => sum + (s.costoFinal || s.costoEstimado || 0),
        0
    );

    const totalAlbaranes = serviciosCompletados.filter((s) => s.albaranId).length;

    const hoy = new Date();
    const proximaFact = new Date(configFacturacion.proximaFacturacion);
    const diasRestantes = Math.max(0, Math.ceil((proximaFact.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)));

    // Group by client
    const porCliente = serviciosCompletados.reduce(
        (acc, s) => {
            if (!acc[s.clienteNombre]) {
                acc[s.clienteNombre] = { servicios: 0, total: 0, albaranes: [] as string[] };
            }
            acc[s.clienteNombre].servicios++;
            acc[s.clienteNombre].total += s.costoFinal || s.costoEstimado || 0;
            if (s.albaranId) acc[s.clienteNombre].albaranes.push(s.albaranId);
            return acc;
        },
        {} as Record<string, { servicios: number; total: number; albaranes: string[] }>
    );

    const guardarPeriodo = () => {
        const meses = parseInt(nuevoPeriodo);
        if (meses >= 1 && meses <= 12) {
            const prox = new Date(configFacturacion.fechaUltimaFacturacion);
            prox.setMonth(prox.getMonth() + meses);
            actualizarConfigFacturacion({
                periodoMeses: meses,
                proximaFacturacion: prox.toISOString().split("T")[0],
            });
            setPeriodoEditando(false);
        }
    };

    return (
        <AppLayout title="Facturación Automática">
            {/* Header stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {[
                    {
                        label: "Total Facturable",
                        value: `€${totalFacturable.toLocaleString("es-ES")}`,
                        icon: Euro,
                        variant: "highlight" as const,
                    },
                    {
                        label: "Albaranes Acumulados",
                        value: String(totalAlbaranes),
                        sub: "listos para facturar",
                        icon: FileText,
                        variant: "default" as const,
                    },
                    {
                        label: "Próxima Facturación",
                        value: `${diasRestantes} días`,
                        sub: proximaFact.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
                        icon: Calendar,
                        variant: "default" as const,
                    },
                    {
                        label: "Periodo Actual",
                        value: `${configFacturacion.periodoMeses} meses`,
                        sub: "configurable",
                        icon: Clock,
                        variant: "default" as const,
                    },
                ].map((stat, i) => (
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
                        <p className="text-2xl sm:text-3xl font-heading font-extrabold">{stat.value}</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Config + Timeline */}
                <div className="lg:col-span-1 space-y-5">
                    {/* Billing period config */}
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h3 className="text-sm font-heading font-extrabold uppercase mb-4 flex items-center gap-2">
                            <Settings className="h-4 w-4 text-primary" />
                            Configuración
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                    Periodo de Facturación
                                </label>
                                {periodoEditando ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={nuevoPeriodo}
                                            onChange={(e) => setNuevoPeriodo(e.target.value)}
                                            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="1">Mensual</option>
                                            <option value="2">Bimestral</option>
                                            <option value="3">Trimestral</option>
                                            <option value="6">Semestral</option>
                                            <option value="12">Anual</option>
                                        </select>
                                        <button
                                            onClick={guardarPeriodo}
                                            className="rounded-lg bg-brand-success px-3 py-2 text-sm font-bold text-white"
                                        >
                                            ✓
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-heading font-bold">
                                            Cada {configFacturacion.periodoMeses} mes{configFacturacion.periodoMeses > 1 ? "es" : ""}
                                        </span>
                                        <button
                                            onClick={() => setPeriodoEditando(true)}
                                            className="text-xs text-primary font-heading font-bold uppercase hover:underline"
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-xs font-heading font-bold uppercase text-muted-foreground">
                                        Auto-envío a Hacienda
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Exportar automáticamente al cumplirse
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        actualizarConfigFacturacion({ autoEnvio: !configFacturacion.autoEnvio })
                                    }
                                    className={`relative h-6 w-11 rounded-full transition-colors ${configFacturacion.autoEnvio ? "bg-brand-success" : "bg-muted"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${configFacturacion.autoEnvio ? "translate-x-5" : "translate-x-0.5"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <Timer className="h-5 w-5 text-primary" />
                            <span className="text-xs font-heading font-bold uppercase text-muted-foreground">
                                Cuenta Atrás
                            </span>
                        </div>
                        <div className="text-center py-4">
                            <p className="text-5xl font-heading font-extrabold text-primary">{diasRestantes}</p>
                            <p className="text-sm text-muted-foreground mt-1">días restantes</p>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden mt-3">
                            <motion.div
                                className="h-full rounded-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.max(5, ((configFacturacion.periodoMeses * 30 - diasRestantes) / (configFacturacion.periodoMeses * 30)) * 100)}%`,
                                }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-2">
                            Última: {new Date(configFacturacion.fechaUltimaFacturacion).toLocaleDateString("es-ES")} → Próxima:{" "}
                            {proximaFact.toLocaleDateString("es-ES")}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-heading font-bold uppercase text-primary-foreground hover:opacity-90 transition-opacity">
                            <Send className="h-4 w-4" />
                            Generar Facturación Ahora
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-heading font-bold uppercase text-foreground hover:bg-muted transition-colors">
                            <Download className="h-4 w-4" />
                            Exportar a Sistema Contable
                        </button>
                    </div>
                </div>

                {/* Right: Client breakdown + details */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Per client breakdown */}
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h3 className="text-sm font-heading font-extrabold uppercase mb-4 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            Desglose por Cliente
                        </h3>
                        {Object.keys(porCliente).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(porCliente).map(([nombre, data], i) => (
                                    <motion.div
                                        key={nombre}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-heading font-bold text-secondary-foreground flex-shrink-0">
                                            {nombre.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-heading font-bold truncate">{nombre}</p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Package className="h-3 w-3" />
                                                    {data.servicios} servicio{data.servicios > 1 ? "s" : ""}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {data.albaranes.length} albarán{data.albaranes.length !== 1 ? "es" : ""}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-lg font-heading font-extrabold text-primary">
                                                €{data.total.toLocaleString("es-ES")}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No hay servicios completados en este periodo</p>
                            </div>
                        )}
                    </div>

                    {/* Completed services list */}
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h3 className="text-sm font-heading font-extrabold uppercase mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-brand-success" />
                            Servicios Completados ({serviciosCompletados.length})
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-3 py-2 text-left font-heading font-bold uppercase text-xs text-muted-foreground">ID</th>
                                        <th className="px-3 py-2 text-left font-heading font-bold uppercase text-xs text-muted-foreground">Cliente</th>
                                        <th className="px-3 py-2 text-left font-heading font-bold uppercase text-xs text-muted-foreground hidden sm:table-cell">Albarán</th>
                                        <th className="px-3 py-2 text-left font-heading font-bold uppercase text-xs text-muted-foreground hidden sm:table-cell">Fecha</th>
                                        <th className="px-3 py-2 text-right font-heading font-bold uppercase text-xs text-muted-foreground">Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviciosCompletados.map((s) => (
                                        <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-3 py-3 font-heading font-bold">{s.id}</td>
                                            <td className="px-3 py-3 truncate max-w-[150px]">{s.clienteNombre}</td>
                                            <td className="px-3 py-3 hidden sm:table-cell">
                                                {s.albaranId ? (
                                                    <span className="text-xs bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full font-bold">
                                                        {s.albaranId}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                                                {s.fechaFinalizacion
                                                    ? new Date(s.fechaFinalizacion).toLocaleDateString("es-ES")
                                                    : "—"}
                                            </td>
                                            <td className="px-3 py-3 text-right font-heading font-extrabold">
                                                €{(s.costoFinal || s.costoEstimado || 0).toLocaleString("es-ES")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {serviciosCompletados.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-muted/50">
                                            <td colSpan={4} className="px-3 py-3 text-right font-heading font-bold uppercase text-xs">
                                                Total
                                            </td>
                                            <td className="px-3 py-3 text-right font-heading font-extrabold text-primary text-lg">
                                                €{totalFacturable.toLocaleString("es-ES")}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>

                    {/* Workflow info */}
                    <div className="rounded-xl border border-brand-info/30 bg-brand-info/5 p-5">
                        <h4 className="text-xs font-heading font-bold uppercase text-brand-info mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Flujo de Facturación Automática
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            {[
                                "Servicio completado",
                                "Albarán generado",
                                "Acumulación",
                                `Cada ${configFacturacion.periodoMeses} meses`,
                                "Factura auto-generada",
                                "Envío a Hacienda",
                            ].map((step, i) => (
                                <span key={i} className="flex items-center gap-1">
                                    <span className="font-heading font-bold bg-card border border-border px-2.5 py-1.5 rounded-lg">
                                        {step}
                                    </span>
                                    {i < 5 && <ArrowRight className="h-3 w-3 text-brand-info" />}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default FacturacionAutoPage;
