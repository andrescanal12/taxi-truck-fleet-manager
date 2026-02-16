---
name: taxitruck-branding
description: Proporciona las directrices visuales, paleta de colores, tipografía y principios de diseño para Taxi Truck. Úsalo cuando necesites crear nuevas interfaces, componentes UI o materiales de marketing que deban ser consistentes con la identidad de marca (Negro Intenso, Amarillo Vibrante y estilo Industrial-Moderno).
---

# 🚀 Inicio Rápido

Copia estas variables CSS en tu archivo de estilos principal para activar el sistema de diseño de Taxi Truck:

```css
:root {
  --tt-black: #000000;
  --tt-black-soft: #1A1A1A;
  --tt-yellow: #FFD000;
  --tt-yellow-alt: #FDB913;
  --tt-white: #FFFFFF;
  --tt-gray: #808080;
  --tt-gray-light: #F5F5F5;
  --tt-font-main: 'Montserrat', sans-serif; /* Peso 800/900 para títulos */
  --tt-font-body: 'Roboto', sans-serif;
}
```

# 📋 Flujo de Trabajo Procedimental

Cuando el usuario pida diseñar o modificar una interfaz para Taxi Truck, sigue estos pasos:

1.  **Consulta de Identidad**: Antes de proponer un diseño, lee `resources/style-guide.md` para entender los valores de marca (Rapidez, Simplicidad, Eficiencia).
2.  **Aplicación de Color**: 
    *   Usa el **Amarillo (#FFD000)** exclusivamente para llamadas a la acción (CTAs), acentos y elementos de alta visibilidad.
    *   Usa el **Negro (#000000)** para fondos sólidos o tipografía de alto impacto.
    *   Mantén fondos blancos generosos para asegurar la legibilidad y el minimalismo.
3.  **Jerarquía Tipográfica**:
    *   Títulos en MAYÚSCULAS, Negrita extrema (Black/Extra Bold) y con kerning comprimido.
    *   Cuerpo de texto en tipografía Sans-serif regular y limpia.
4.  **Uso de Iconos**: Emplea iconos lineales de 2-3px de grosor con esquinas ligeramente redondeadas.
5.  **Validación de Estilo**: Comprueba que el diseño no incluya degradados complejos, sombras exageradas o tipografías decorativas que rompan la estética industrial.

# 🛠️ Uso de Herramientas y Recursos

Esta skill separa la lógica de los datos pesados para optimizar el contexto:

-   **Guía Completa**: Si necesitas detalles técnicos sobre rotulación, fotografía o tonos de voz, usa `view_file` en `.agent/skills/taxitruck-branding/resources/style-guide.md`.
-   **Variables de Diseño**: Importa `.agent/skills/taxitruck-branding/resources/branding.css` en tus proyectos para consistencia inmediata.
-   **Componentes de Ejemplo**: Revisa `.agent/skills/taxitruck-branding/examples/BrandButton.tsx` para ver cómo aplicar los estados de hover y diseño dinámico.

# ⚠️ Restricciones de Calidad

-   **Eficiencia de Tokens**: No copies la guía de estilo completa en tus respuestas. Cita secciones específicas si es necesario.
-   **Consistencia**: Antes de finalizar cualquier UI, verifica la sección "Elementos a Evitar" en la guía de estilo.
-   **Prevalencia**: El amarillo es un acento, nunca debe ser el color de fondo predominante en bloques grandes de texto.
