import React, { createContext, useContext, useState, useCallback } from "react";

export type EstadoServicio =
    | "pendiente"
    | "asignado"
    | "en_camino"
    | "recogiendo"
    | "en_transito"
    | "entregado"
    | "completado"
    | "cancelado";

export type TipoCarga =
    | "mudanza"
    | "paqueteria"
    | "material_construccion"
    | "electrodomesticos"
    | "maquinaria"
    | "alimentacion"
    | "otro";

export interface Coordenadas {
    lat: number;
    lng: number;
}

export interface Servicio {
    id: string;
    clienteId: string;
    clienteNombre: string;
    clienteTelefono: string;
    trabajadorId?: string;
    trabajadorNombre?: string;
    origen: string;
    origenCoords?: Coordenadas;
    destino: string;
    destinoCoords?: Coordenadas;
    tipoCarga: TipoCarga;
    descripcionCarga: string;
    pesoEstimado?: string;
    estado: EstadoServicio;
    fechaCreacion: string;
    fechaAsignacion?: string;
    fechaFinalizacion?: string;
    etaMinutos?: number;
    progreso: number; // 0-100
    costoEstimado?: number;
    costoFinal?: number;
    albaranId?: string;
    albaranFotoUrl?: string;
    notas?: string;
    posicionActual?: Coordenadas;
}

export interface Trabajador {
    id: string;
    nombre: string;
    telefono: string;
    vehiculo: string;
    matricula: string;
    estado: "disponible" | "en_servicio" | "desconectado";
    posicion?: Coordenadas;
    serviciosCompletados: number;
    valoracion: number;
}

export interface ConfigFacturacion {
    periodoMeses: number;
    fechaUltimaFacturacion: string;
    proximaFacturacion: string;
    autoEnvio: boolean;
}

interface ServiciosContextType {
    servicios: Servicio[];
    trabajadores: Trabajador[];
    configFacturacion: ConfigFacturacion;
    crearServicio: (servicio: Omit<Servicio, "id" | "fechaCreacion" | "estado" | "progreso">) => string;
    actualizarEstadoServicio: (id: string, estado: EstadoServicio, datos?: Partial<Servicio>) => void;
    asignarTrabajador: (servicioId: string, trabajadorId: string) => void;
    completarServicio: (servicioId: string, costoFinal: number, albaranFotoUrl?: string) => void;
    actualizarConfigFacturacion: (config: Partial<ConfigFacturacion>) => void;
    serviciosPendientes: Servicio[];
    serviciosActivos: Servicio[];
    serviciosCompletados: Servicio[];
    trabajadoresDisponibles: Trabajador[];
}

const generarId = () => `SRV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

// Datos de demostración
const serviciosDemo: Servicio[] = [
    {
        id: "SRV-A1B2C3",
        clienteId: "CLI-001",
        clienteNombre: "María García López",
        clienteTelefono: "+34 612 345 678",
        trabajadorId: "TRB-001",
        trabajadorNombre: "Carlos Martínez",
        origen: "Calle Gran Vía 42, Madrid",
        origenCoords: { lat: 40.4200, lng: -3.7025 },
        destino: "Polígono Industrial Cobo Calleja, Fuenlabrada",
        destinoCoords: { lat: 40.2833, lng: -3.8000 },
        tipoCarga: "electrodomesticos",
        descripcionCarga: "4 electrodomésticos grandes (nevera, lavadora, lavavajillas, horno)",
        pesoEstimado: "350 kg",
        estado: "en_transito",
        fechaCreacion: "2026-02-16T10:30:00",
        fechaAsignacion: "2026-02-16T10:35:00",
        etaMinutos: 25,
        progreso: 62,
        costoEstimado: 185,
        posicionActual: { lat: 40.3756, lng: -3.7410 },
    },
    {
        id: "SRV-D4E5F6",
        clienteId: "CLI-002",
        clienteNombre: "Transportes Veloz S.L.",
        clienteTelefono: "+34 915 678 901",
        trabajadorId: "TRB-002",
        trabajadorNombre: "Ana Rodríguez",
        origen: "Puerto de Valencia, Muelle Norte",
        origenCoords: { lat: 39.4432, lng: -0.3254 },
        destino: "Almacén Central Barcelona, Zona Franca",
        destinoCoords: { lat: 41.3431, lng: 2.1326 },
        tipoCarga: "paqueteria",
        descripcionCarga: "Pallets de productos electrónicos (15 unidades)",
        pesoEstimado: "2.200 kg",
        estado: "en_camino",
        fechaCreacion: "2026-02-16T08:15:00",
        fechaAsignacion: "2026-02-16T08:20:00",
        etaMinutos: 45,
        progreso: 35,
        costoEstimado: 420,
        posicionActual: { lat: 39.8500, lng: -0.1200 },
    },
    {
        id: "SRV-G7H8I9",
        clienteId: "CLI-003",
        clienteNombre: "Pedro Sánchez Ruiz",
        clienteTelefono: "+34 643 210 987",
        origen: "Avenida de la Constitución 8, Sevilla",
        origenCoords: { lat: 37.3886, lng: -5.9823 },
        destino: "Calle Sierpes 15, Sevilla",
        destinoCoords: { lat: 37.3900, lng: -5.9945 },
        tipoCarga: "mudanza",
        descripcionCarga: "Mudanza completa piso 3 habitaciones",
        pesoEstimado: "1.500 kg",
        estado: "pendiente",
        fechaCreacion: "2026-02-16T12:00:00",
        progreso: 0,
        costoEstimado: 350,
    },
    {
        id: "SRV-J1K2L3",
        clienteId: "CLI-004",
        clienteNombre: "Construcciones del Norte S.A.",
        clienteTelefono: "+34 944 567 890",
        origen: "Cantera Montes, Bilbao",
        origenCoords: { lat: 43.2630, lng: -2.9350 },
        destino: "Obra C/ Alameda 22, Bilbao",
        destinoCoords: { lat: 43.2569, lng: -2.9234 },
        tipoCarga: "material_construccion",
        descripcionCarga: "Arena y grava para cimentación (camión completo)",
        pesoEstimado: "12.000 kg",
        estado: "pendiente",
        fechaCreacion: "2026-02-16T11:45:00",
        progreso: 0,
        costoEstimado: 280,
    },
    {
        id: "SRV-M4N5O6",
        clienteId: "CLI-005",
        clienteNombre: "Restaurante El Fogón",
        clienteTelefono: "+34 961 234 567",
        trabajadorId: "TRB-003",
        trabajadorNombre: "Miguel Fernández",
        origen: "Mercamadrid, Nave 14",
        origenCoords: { lat: 40.3655, lng: -3.6604 },
        destino: "C/ Alcalá 200, Madrid",
        destinoCoords: { lat: 40.4245, lng: -3.6700 },
        tipoCarga: "alimentacion",
        descripcionCarga: "Productos frescos refrigerados (mariscos y verduras)",
        pesoEstimado: "450 kg",
        estado: "entregado",
        fechaCreacion: "2026-02-16T06:00:00",
        fechaAsignacion: "2026-02-16T06:05:00",
        fechaFinalizacion: "2026-02-16T07:30:00",
        progreso: 100,
        costoEstimado: 120,
        costoFinal: 135,
        albaranId: "ALB-2026-0215",
        albaranFotoUrl: "/placeholder-albaran.jpg",
    },
];

const trabajadoresDemo: Trabajador[] = [
    {
        id: "TRB-001",
        nombre: "Carlos Martínez",
        telefono: "+34 655 123 456",
        vehiculo: "Mercedes Sprinter 316 CDI",
        matricula: "4521 GHK",
        estado: "en_servicio",
        posicion: { lat: 40.3756, lng: -3.7410 },
        serviciosCompletados: 234,
        valoracion: 4.8,
    },
    {
        id: "TRB-002",
        nombre: "Ana Rodríguez",
        telefono: "+34 677 234 567",
        vehiculo: "Iveco Daily 35S18",
        matricula: "8901 JKL",
        estado: "en_servicio",
        posicion: { lat: 39.8500, lng: -0.1200 },
        serviciosCompletados: 189,
        valoracion: 4.9,
    },
    {
        id: "TRB-003",
        nombre: "Miguel Fernández",
        telefono: "+34 699 345 678",
        vehiculo: "Ford Transit 350L Refrigerado",
        matricula: "3456 MNP",
        estado: "disponible",
        posicion: { lat: 40.4160, lng: -3.7038 },
        serviciosCompletados: 312,
        valoracion: 4.7,
    },
    {
        id: "TRB-004",
        nombre: "Laura Jiménez",
        telefono: "+34 611 456 789",
        vehiculo: "MAN TGE 3.180",
        matricula: "7890 QRS",
        estado: "disponible",
        posicion: { lat: 40.4530, lng: -3.6883 },
        serviciosCompletados: 156,
        valoracion: 4.6,
    },
    {
        id: "TRB-005",
        nombre: "Javier López",
        telefono: "+34 633 567 890",
        vehiculo: "Volkswagen Crafter 35",
        matricula: "1234 TUV",
        estado: "desconectado",
        serviciosCompletados: 87,
        valoracion: 4.5,
    },
];

const ServiciosContext = createContext<ServiciosContextType | undefined>(undefined);

export const ServiciosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [servicios, setServicios] = useState<Servicio[]>(() => {
        const saved = localStorage.getItem("taxitruck-servicios");
        return saved ? JSON.parse(saved) : serviciosDemo;
    });

    const [trabajadores, setTrabajadores] = useState<Trabajador[]>(() => {
        const saved = localStorage.getItem("taxitruck-trabajadores");
        return saved ? JSON.parse(saved) : trabajadoresDemo;
    });

    const [configFacturacion, setConfigFacturacion] = useState<ConfigFacturacion>(() => {
        const saved = localStorage.getItem("taxitruck-facturacion-config");
        return saved
            ? JSON.parse(saved)
            : {
                periodoMeses: 3,
                fechaUltimaFacturacion: "2025-12-01",
                proximaFacturacion: "2026-03-01",
                autoEnvio: false,
            };
    });

    const guardarServicios = (s: Servicio[]) => {
        setServicios(s);
        localStorage.setItem("taxitruck-servicios", JSON.stringify(s));
    };

    const crearServicio = useCallback(
        (data: Omit<Servicio, "id" | "fechaCreacion" | "estado" | "progreso">): string => {
            const id = generarId();
            const nuevo: Servicio = {
                ...data,
                id,
                estado: "pendiente",
                progreso: 0,
                fechaCreacion: new Date().toISOString(),
            };
            const actualizados = [...servicios, nuevo];
            guardarServicios(actualizados);
            return id;
        },
        [servicios]
    );

    const actualizarEstadoServicio = useCallback(
        (id: string, estado: EstadoServicio, datos?: Partial<Servicio>) => {
            const actualizados = servicios.map((s) =>
                s.id === id ? { ...s, estado, ...datos } : s
            );
            guardarServicios(actualizados);
        },
        [servicios]
    );

    const asignarTrabajador = useCallback(
        (servicioId: string, trabajadorId: string) => {
            const trabajador = trabajadores.find((t) => t.id === trabajadorId);
            if (!trabajador) return;

            const serviciosActualizados = servicios.map((s) =>
                s.id === servicioId
                    ? {
                        ...s,
                        trabajadorId,
                        trabajadorNombre: trabajador.nombre,
                        estado: "asignado" as EstadoServicio,
                        fechaAsignacion: new Date().toISOString(),
                    }
                    : s
            );
            guardarServicios(serviciosActualizados);

            const trabajadoresActualizados = trabajadores.map((t) =>
                t.id === trabajadorId ? { ...t, estado: "en_servicio" as const } : t
            );
            setTrabajadores(trabajadoresActualizados);
            localStorage.setItem("taxitruck-trabajadores", JSON.stringify(trabajadoresActualizados));
        },
        [servicios, trabajadores]
    );

    const completarServicio = useCallback(
        (servicioId: string, costoFinal: number, albaranFotoUrl?: string) => {
            const serviciosActualizados = servicios.map((s) =>
                s.id === servicioId
                    ? {
                        ...s,
                        estado: "completado" as EstadoServicio,
                        progreso: 100,
                        costoFinal,
                        albaranFotoUrl,
                        fechaFinalizacion: new Date().toISOString(),
                        albaranId: `ALB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
                    }
                    : s
            );
            guardarServicios(serviciosActualizados);

            const servicio = servicios.find((s) => s.id === servicioId);
            if (servicio?.trabajadorId) {
                const trabajadoresActualizados = trabajadores.map((t) =>
                    t.id === servicio.trabajadorId
                        ? { ...t, estado: "disponible" as const, serviciosCompletados: t.serviciosCompletados + 1 }
                        : t
                );
                setTrabajadores(trabajadoresActualizados);
                localStorage.setItem("taxitruck-trabajadores", JSON.stringify(trabajadoresActualizados));
            }
        },
        [servicios, trabajadores]
    );

    const actualizarConfigFacturacion = useCallback(
        (config: Partial<ConfigFacturacion>) => {
            setConfigFacturacion((prev) => {
                const next = { ...prev, ...config };
                localStorage.setItem("taxitruck-facturacion-config", JSON.stringify(next));
                return next;
            });
        },
        []
    );

    const serviciosPendientes = servicios.filter((s) => s.estado === "pendiente");
    const serviciosActivos = servicios.filter((s) =>
        ["asignado", "en_camino", "recogiendo", "en_transito"].includes(s.estado)
    );
    const serviciosCompletadosArr = servicios.filter((s) =>
        ["entregado", "completado"].includes(s.estado)
    );

    const trabajadoresDisponibles = trabajadores.filter((t) => t.estado === "disponible");

    return (
        <ServiciosContext.Provider
            value={{
                servicios,
                trabajadores,
                configFacturacion,
                crearServicio,
                actualizarEstadoServicio,
                asignarTrabajador,
                completarServicio,
                actualizarConfigFacturacion,
                serviciosPendientes,
                serviciosActivos,
                serviciosCompletados: serviciosCompletadosArr,
                trabajadoresDisponibles,
            }}
        >
            {children}
        </ServiciosContext.Provider>
    );
};

export const useServicios = () => {
    const context = useContext(ServiciosContext);
    if (!context) throw new Error("useServicios must be used within ServiciosProvider");
    return context;
};
