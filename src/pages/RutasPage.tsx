import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { MapPin, Plus, Navigation, Clock, Truck } from "lucide-react";

interface Destino {
  id: string;
  direccion: string;
  ciudad: string;
  cp: string;
  prioridad: "alta" | "media" | "baja";
}

const mockDestinos: Destino[] = [
  { id: "1", direccion: "Calle Gran Vía 42", ciudad: "Madrid", cp: "28013", prioridad: "alta" },
  { id: "2", direccion: "Av. Diagonal 211", ciudad: "Barcelona", cp: "08018", prioridad: "media" },
  { id: "3", direccion: "Calle Colón 15", ciudad: "Valencia", cp: "46004", prioridad: "baja" },
];

const prioridadStyles = {
  alta: "bg-destructive/10 text-destructive border-destructive/20",
  media: "bg-primary/10 text-primary-foreground border-primary/20",
  baja: "bg-brand-success/10 text-brand-success border-brand-success/20",
};

const RutasPage = () => {
  const [destinos, setDestinos] = useState<Destino[]>(mockDestinos);
  const [showForm, setShowForm] = useState(false);
  const [newDestino, setNewDestino] = useState({ direccion: "", ciudad: "", cp: "", prioridad: "media" as const });

  const addDestino = () => {
    if (!newDestino.direccion || !newDestino.ciudad) return;
    setDestinos([...destinos, { ...newDestino, id: Date.now().toString() }]);
    setNewDestino({ direccion: "", ciudad: "", cp: "", prioridad: "media" });
    setShowForm(false);
  };

  const removeDestino = (id: string) => {
    setDestinos(destinos.filter((d) => d.id !== id));
  };

  return (
    <AppLayout title="Rutas">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Destinations List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-extrabold uppercase">Destinos ({destinos.length})</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-heading font-bold uppercase text-primary-foreground hover:bg-brand-yellow-hover transition-colors"
            >
              <Plus className="h-3 w-3" />
              Añadir
            </button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <input
                type="text"
                placeholder="Dirección"
                value={newDestino.direccion}
                onChange={(e) => setNewDestino({ ...newDestino, direccion: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={newDestino.ciudad}
                  onChange={(e) => setNewDestino({ ...newDestino, ciudad: e.target.value })}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder="CP"
                  value={newDestino.cp}
                  onChange={(e) => setNewDestino({ ...newDestino, cp: e.target.value })}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <select
                value={newDestino.prioridad}
                onChange={(e) => setNewDestino({ ...newDestino, prioridad: e.target.value as any })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="alta">Alta prioridad</option>
                <option value="media">Media prioridad</option>
                <option value="baja">Baja prioridad</option>
              </select>
              <button
                onClick={addDestino}
                className="w-full rounded-lg bg-secondary px-3 py-2 text-sm font-heading font-bold uppercase text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                Guardar Destino
              </button>
            </motion.div>
          )}

          <div className="space-y-2">
            {destinos.map((destino, i) => (
              <motion.div
                key={destino.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{destino.direccion}</p>
                      <p className="text-xs text-muted-foreground">{destino.ciudad}, {destino.cp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-heading font-bold uppercase ${prioridadStyles[destino.prioridad]}`}>
                      {destino.prioridad}
                    </span>
                    <button
                      onClick={() => removeDestino(destino.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive text-xs transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 py-4 text-sm font-heading font-bold uppercase text-primary-foreground hover:border-primary hover:bg-primary/10 transition-all">
            <Navigation className="h-4 w-4" />
            Optimizar Ruta
          </button>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden h-[600px] flex flex-col">
            <div className="border-b border-border bg-muted/30 px-5 py-3 flex items-center justify-between">
              <span className="font-heading font-bold text-sm uppercase text-foreground">Mapa de Rutas</span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> 3 Vehículos</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~4h 22min</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-muted/20 relative">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-brand-yellow" />
                </div>
                <p className="font-heading font-bold uppercase text-foreground">Google Maps</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Configura tu API key de Google Maps en Ajustes para visualizar las rutas en el mapa.
                </p>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 speed-lines opacity-30 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RutasPage;
