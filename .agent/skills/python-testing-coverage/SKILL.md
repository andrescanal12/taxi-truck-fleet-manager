---
name: python-testing-coverage
description: Automatiza la ejecución de pruebas unitarias con pytest y genera informes detallados de cobertura de código. Identifica líneas no probadas y asegura la calidad del código mediante métricas deterministas. Úsalo cuando necesites validar lógica de Python o verificar el porcentaje de cobertura antes de un despliegue.
---

# 🚀 Inicio Rápido

Ejecuta todas las pruebas y genera un informe de cobertura en la terminal con un solo comando:
```bash
pytest --cov=. --cov-report=term-missing
```

# 📋 Flujo de Trabajo Procedimental

Sigue estos pasos para garantizar una validación completa del código:

1. **Descubrimiento de Entorno**: Verifica que `pytest` y `pytest-cov` estén instalados. Si no, instala las dependencias necesarias.
2. **Análisis de Archivos**: Identifica los módulos de Python y sus archivos de prueba correspondientes (normalmente en `tests/` o archivos `test_*.py`).
3. **Ejecución de Pruebas**: Ejecuta el comando de inicio rápido.
4. **Interpretación de Resultados**:
    - Si las pruebas fallan: Analiza los logs de error y corrige el código fuente.
    - Si la cobertura es baja (<80%): Revisa el informe detallado para identificar qué funciones o ramas carecen de pruebas.
5. **Generación de Informe Visual (Opcional)**: Ejecuta `pytest --cov=. --cov-report=html` para obtener un desglose visual en la carpeta `htmlcov/`.
6. **Limpieza**: Asegúrate de no incluir archivos temporales de cobertura (`.coverage`) en el control de versiones.

# 🛠️ Uso de Herramientas y Recursos

Esta skill utiliza scripts externos para manejar tareas pesadas de procesamiento de datos:

- **Lectura de Recursos**: Si el proyecto es grande, utiliza `view_file` sobre el archivo `.agent/skills/python-testing-coverage/scripts/report_coverage.py` para obtener un resumen personalizado de la cobertura sin saturar el contexto del chat.
- **Ejemplos**: Consulta `examples/test_example.py` para ver patrones recomendados de *mocking* y *fixtures*.
- **Scripts Deterministas**: Para integraciones CI/CD, utiliza siempre los scripts de la carpeta `scripts/` en lugar de generar comandos manuales repetitivos.

# ⚠️ Restricciones de Calidad y Seguridad

- **Eficiencia de Tokens**: No pegues resultados de cobertura de miles de líneas en el chat. Resume los porcentajes clave por módulo.
- **Lógica Determinista**: Favorece el uso de `pytest.mark.parametrize` para pruebas repetitivas.
- **Seguridad**: Siempre audita los scripts generados en `scripts/` antes de ejecutarlos en entornos sensibles. Verifica que no haya rutas de archivos hardcodeadas.
