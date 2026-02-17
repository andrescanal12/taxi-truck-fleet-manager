import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Truck,
    Plus,
    Minus,
    Crosshair,
    Layers,
    MapPin,
    Headset,
    AlertTriangle,
    Fuel,
    Activity,
    User,
    Navigation
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

// Mock Data
interface Vehicle {
    id: string;
    name: string;
    driver: string;
    status: "active" | "idle" | "stopped";
    speed: number;
    fuel: number;
    location: string;
    destination: string;
    eta: string;
    x: number; // % position
    y: number; // % position
    avatar: string; // Placeholder color or initals
}

const INITIAL_VEHICLES: Vehicle[] = [
    {
        id: "T-01",
        name: "Camión T-01",
        driver: "Carlos Mendoza",
        status: "active",
        speed: 85,
        fuel: 72,
        location: "Av. Insurgentes Sur, CDMX",
        destination: "Planta Norte A-4",
        eta: "24 min",
        x: 33,
        y: 25,
        avatar: "CM",
    },
    {
        id: "V-04",
        name: "Van V-04",
        driver: "Ana López",
        status: "idle",
        speed: 0,
        fuel: 34,
        location: "Centro Logístico Sur",
        destination: "En espera",
        eta: "--",
        x: 75,
        y: 66,
        avatar: "AL",
    },
    {
        id: "T-12",
        name: "Camión T-12",
        driver: "Roberto Gomez",
        status: "stopped",
        speed: 0,
        fuel: 90,
        location: "Taller Central",
        destination: "Mantenimiento",
        eta: "--",
        x: 20,
        y: 80,
        avatar: "RG",
    },
    {
        id: "T-03",
        name: "Camión T-03",
        driver: "Luis Ramirez",
        status: "active",
        speed: 62,
        fuel: 55,
        location: "Autopista Norte",
        destination: "Almacén B",
        eta: "45 min",
        x: 55,
        y: 45,
        avatar: "LR",
    },
];

const SeguimientoPage = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);

    // Simulation effect
    useEffect(() => {
        // Simulate movement for active vehicles
        const interval = setInterval(() => {
            setVehicles((prev) =>
                prev.map((v) => {
                    if (v.status !== "active") return v;
                    // Random small movement
                    const dx = (Math.random() - 0.5) * 2; // -1 to 1
                    const dy = (Math.random() - 0.5) * 2;
                    return {
                        ...v,
                        x: Math.max(5, Math.min(95, v.x + dx)), // Clamp between 5% and 95%
                        y: Math.max(5, Math.min(95, v.y + dy)),
                        speed: Math.max(0, Math.min(120, v.speed + (Math.random() - 0.5) * 5))
                    };
                })
            );
        }, 2000);

        // Random alert
        const alertTimer = setTimeout(() => {
            setAlertVisible(true);
            setTimeout(() => setAlertVisible(false), 5000);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(alertTimer);
        };
    }, []);

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

    return (
        <AppLayout title="Seguimiento GPS">
            <div className="relative w-full h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-border shadow-sm flex flex-col md:flex-row bg-slate-100">

                {/* MAP AREA (Changes to Light Theme) */}
                <div className="relative flex-1 bg-slate-200 overflow-hidden">
                    {/* Light Map Grid Background */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Map Vehicles */}
                    <div className="relative h-full w-full">
                        {vehicles.map((v) => (
                            <motion.div
                                key={v.id}
                                initial={false}
                                animate={{ left: `${v.x}%`, top: `${v.y}%` }}
                                transition={{ duration: 2, ease: "linear" }}
                                className="absolute z-10 cursor-pointer group"
                                onClick={() => setSelectedVehicleId(v.id)}
                            >
                                <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                                    {/* Pulse Effect for Active */}
                                    {v.status === "active" && (
                                        <div className="absolute w-12 h-12 bg-brand-yellow/20 rounded-full pulse-yellow" />
                                    )}

                                    {/* Vehicle Marker - Adapted for Light Mode */}
                                    <div
                                        className={`relative p-2 rounded-lg shadow-md flex items-center justify-center transition-transform group-hover:scale-110 border-2 ${selectedVehicleId === v.id
                                                ? "bg-brand-yellow text-black border-white scale-110"
                                                : v.status === "active"
                                                    ? "bg-white text-brand-yellow border-brand-yellow"
                                                    : "bg-white text-muted-foreground border-slate-300"
                                            }`}
                                    >
                                        <Truck className="h-5 w-5" />
                                    </div>

                                    {/* Tooltip Label */}
                                    <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 transition-opacity ${selectedVehicleId === v.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        }`}>
                                        <span className="bg-white px-2 py-1 rounded text-[10px] font-bold border border-border shadow-sm text-foreground uppercase tracking-wider">
                                            {v.id}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Simulated Route Line */}
                        {selectedVehicle && selectedVehicle.status === "active" && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                                <motion.path
                                    d={`M ${selectedVehicle.x * 10 + 200} ${selectedVehicle.y * 5 + 100} Q ${selectedVehicle.x * 15} ${selectedVehicle.y * 10} ${selectedVehicle.x}% ${selectedVehicle.y}%`}
                                    fill="none"
                                    stroke="#eab308" // Darker yellow for visibility on light bg
                                    strokeWidth="3"
                                    strokeDasharray="8 4"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.5 }}
                                />
                            </svg>
                        )}
                    </div>

                    {/* Map Controls */}
                    <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
                        <button className="h-9 w-9 bg-white rounded-lg shadow-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="h-5 w-5" />
                        </button>
                        <button className="h-9 w-9 bg-white rounded-lg shadow-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                            <Minus className="h-5 w-5" />
                        </button>
                        <div className="h-px bg-border my-1 mx-2" />
                        <button className="h-9 w-9 bg-white rounded-lg shadow-sm border border-brand-yellow flex items-center justify-center text-brand-yellow hover:text-primary transition-colors">
                            <Crosshair className="h-5 w-5" />
                        </button>
                        <button className="h-9 w-9 bg-white rounded-lg shadow-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                            <Layers className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Alert Banner */}
                    <AnimatePresence>
                        {alertVisible && (
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 20, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 z-30"
                            >
                                <div className="bg-destructive text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-xs font-bold uppercase">Alerta: Frenado brusco T-01</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* SIDE PANELS AREA (White Cards) */}
                <div className="w-full md:w-96 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.02)]">

                    {/* List Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                        <h3 className="font-heading font-extrabold uppercase text-sm flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            Flota Activa
                        </h3>
                        <span className="text-xs font-bold bg-brand-yellow text-black px-2 py-0.5 rounded-full">
                            {vehicles.filter(v => v.status === 'active').length} EN RUTA
                        </span>
                    </div>

                    {/* Vehicle List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-card">
                        {vehicles.map((v) => (
                            <div
                                key={v.id}
                                onClick={() => setSelectedVehicleId(v.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedVehicleId === v.id
                                        ? "bg-brand-yellow/10 border-brand-yellow"
                                        : "bg-white border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${v.status === 'active' ? 'bg-green-500 shadow-sm' :
                                                v.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} />
                                        <span className="font-heading font-bold text-sm text-foreground">
                                            {v.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase bg-muted px-1.5 py-0.5 rounded">
                                        {v.status === 'active' ? 'En Ruta' : v.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3 w-3" />
                                        <span className="truncate max-w-[80px]">{v.driver.split(' ')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="h-3 w-3" />
                                        <span>{Math.round(v.speed)} km/h</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Fuel className="h-3 w-3" />
                                        <span className={`${v.fuel < 20 ? 'text-red-500 font-bold' : ''}`}>{v.fuel}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Details Widget (Bottom Fixed) */}
                    <div className="p-5 bg-muted/30 border-t border-border">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-white border-2 border-brand-yellow flex items-center justify-center text-lg font-heading font-black shadow-sm">
                                {selectedVehicle.avatar}
                            </div>
                            <div>
                                <h4 className="font-heading font-extrabold text-foreground leading-tight">{selectedVehicle.driver}</h4>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate max-w-[150px]">{selectedVehicle.location}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-white p-2.5 rounded-lg border border-border shadow-sm">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Destino</span>
                                <span className="text-xs font-bold text-foreground truncate block">{selectedVehicle.destination}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-lg border border-border shadow-sm">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">ETA</span>
                                <span className="text-xs font-bold text-primary truncate block">{selectedVehicle.eta}</span>
                            </div>
                        </div>

                        <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-heading font-bold uppercase text-sm shadow-md hover:bg-brand-yellow-hover transition-colors flex items-center justify-center gap-2">
                            <Headset className="h-4 w-4" />
                            Contactar
                        </button>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
};

export default SeguimientoPage;
