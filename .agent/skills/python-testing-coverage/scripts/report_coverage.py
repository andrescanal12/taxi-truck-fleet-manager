import json
import os
import sys

def summarize_coverage(json_file='.coverage.json'):
    """
    Lee un archivo JSON de cobertura y devuelve un resumen compacto 
    para no saturar el contexto de la IA.
    """
    if not os.path.exists(json_file):
        print(f"Error: No se encontró el informe {json_file}. Ejecuta 'pytest --cov=. --cov-report=json' primero.")
        return
    
    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        summary = {
            "total_percent": data['totals']['percent_covered'],
            "files_with_missing_lines": {}
        }
        
        for filepath, details in data['files'].items():
            if details['missing_lines']:
                summary["files_with_missing_lines"][filepath] = {
                    "percent_covered": details['summary']['percent_covered'],
                    "missing_lines": details['missing_lines']
                }
        
        print(json.dumps(summary, indent=2))
    except Exception as e:
        print(f"Error procesando el archivo de cobertura: {e}")

if __name__ == "__main__":
    summarize_coverage()
