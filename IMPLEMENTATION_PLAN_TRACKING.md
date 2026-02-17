# Plan de Implementación: Módulo de Seguimiento de Flota (Live Tracking)

Este documento detalla la estrategia para integrar el diseño "Premium Dark Mode" generado en Stitch dentro de la aplicación actual **Taxi Truck Fleet Manager**.

## 🎯 Objetivo
Convertir el diseño estático HTML/CSS de Stitch en una interfaz funcional, responsiva y dinámica dentro del proyecto React existente, manteniendo la estética "futurista" y la identidad de marca.

## 🛠️ Tecnologías Base
Aunque el proyecto usa React, respetaremos la estructura nativa del diseño original:
- **HTML (JSX)**: Estructura semántica.
- **CSS (Tailwind)**: Estilos utilitarios y efectos visuales (Glassmorphism).
- **JavaScript (TypeScript)**: Lógica de interacción y simulación de datos en tiempo real.

---

## 📅 Fases de Desarrollo

### Fase 1: Configuración de Estilos Globales (Theme Setup)
El diseño introduce nuevos tokens visuales que deben estar disponibles en toda la app.

1. **Actualizar `index.html`**:
   - Importar fuentes: `Space Grotesk` (para numeración y títulos técnicos).
   - Importar iconos: `Material Symbols Outlined` (o migrar a `Lucide React` para consistencia, se recomienda Lucide por ser estándar en el proyecto actual, pero el diseño usa Material). *Decisión: Adaptar a Lucide React para mantener consistencia con el proyecto.*

2. **Extender `tailwind.config.ts`**:
   - Añadir colores: `surface-dark` (#121212), `branding-yellow` (#ffd000).
   - Añadir animaciones: `pulse-yellow` (keyframes).
   - Crear clases utilitarias para "Glassmorphism" (`.glass-panel`) en `index.css`.

### Fase 2: Construcción del Layout "Command Center"
Reemplazar la página actual `/seguimiento`.

1. **Estructura de la Pantalla (`SeguimientoPage.tsx`)**:
   - **Fondo**: Capa base negra (`#000000`) + Grid CSS (`.map-grid`) para el fondo técnico.
   - **Contenedores**: Implementar la lógica responsiva:
     - **Desktop**: Sidebar lateral + Paneles flotantes (z-index alto).
     - **Móvil**: Barra de navegación inferior + Paneles apilados o colapsables.

2. **Componentes UI (Átomos)**:
   - `VehicleMarker`: Componente para el punto pulsante en el mapa.
   - `StatusPanel`: Lista izquierda de vehículos con barras de combustible.
   - `DetailPanel`: Tarjeta derecha con información del conductor y velocímetro.

### Fase 3: Integración de Mapa Funcional (Map Engine)
El diseño usa un fondo estático. Para hacerlo funcional:

Option A (Simulación Visual - Recomendada Inicialmente):
- Mantener el "Grid CSS" de fondo para la estética futurista exacta del diseño.
- Mover los "Marcadores" (`divs` absolutos) usando coordenadas relativas (%) calculadas por JS.

Option B (Mapa Real - Leaflet):
- Integrar `react-leaflet`.
- Aplicar un filtro CSS "Dark Mode" agresivo (Invert/Grayscale) al mapa base para igualar el color negro mate del diseño.

*Plan Inicial: Implementar Opción A para fidelidad visual inmediata, preparada para migrar a B.*

### Fase 4: Lógica de Negocio (JavaScript)
Dar vida a la interfaz estática.

1. **Estado Local**:
   - `selectedVehicle`: ID del vehículo seleccionado (controla qué panel de detalle se muestra).
   - `vehiclesData`: Array de objetos con posición (x, y), estado, combustible, conductor.

2. **Simulación de Tiempo Real**:
   - `useEffect` con `setInterval`: Actualizar las coordenadas (x,y) de los vehículos cada 2 segundos para simular movimiento.
   - **Animación**: Usar CSS transitions (`transition-all duration-2000 ease-linear`) para que el movimiento de los puntos sea fluido.

---

## 📝 Lista de Tareas (Checklist)

- [x] Instalar fuentes y configurar Tailwind.
- [x] Crear componente `SeguimientoPage.tsx` limpio.
- [x] Implementar el fondo "Map Grid" y estilos Glassmorphism.
- [x] Maquetar los paneles flotantes (Izquierda y Derecha).
- [x] Crear la lógica de "Selección de Vehículo".
- [x] Añadir animación de movimiento simulado.
- [ ] Adaptar a móvil (Bottom Nav).

Este plan asegura que el diseño "Premium" se integre funcionalmente sin romper la arquitectura actual.
