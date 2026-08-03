# FING Horarios

Aplicación para que estudiantes de la Facultad de Ingeniería (Udelar) combinen materias y obtengan los mejores horarios posibles.

## Requisitos

- Python 3.10+
- Node.js 18+
- SQLite (incluido con Python) o PostgreSQL

## Backend

```bash
cd backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Migrar
python3 manage.py migrate

# Importar horarios reales desde Bedelía
python3 manage.py import_schedules --replace-semester

# (Opcional) Cargar datos de prueba en vez de scraping
# python3 manage.py seed_data

# Arrancar servidor
python3 manage.py runserver
```

El backend corre en `http://localhost:8000`.

### Importar horarios

El comando `import_schedules` scrapea los PDFs de la página de Bedelía y carga las materias en la base de datos. Si no se especifica año/período, detecta el semestre vigente publicado por Bedelía.

```bash
# Importar automáticamente desde la página de Bedelía
python3 manage.py import_schedules --replace-semester

# Importar un PDF específico
python3 manage.py import_schedules --url "https://www.fing.edu.uy/sites/default/files/2026-05/horarios-1er-semestre-2026_1.pdf"

# Especificar año y período
python3 manage.py import_schedules --year 2026 --period sem2 --replace-semester
```

Para producción, usar `sync_schedules`. Este comando revisa los PDFs publicados, calcula un hash y solo reimporta si detecta cambios. Primero parsea los PDFs y recién después reemplaza la base del semestre, para evitar borrar datos si falla la detección.

```bash
python3 manage.py sync_schedules

# Forzar reimportación aunque el hash sea igual
python3 manage.py sync_schedules --force
```

En Render se recomienda crear un Cron Job diario con:

```bash
python manage.py migrate && python manage.py sync_schedules
```

La página de Bedelía se actualiza cuando cambia el semestre. `sync_schedules` detecta el semestre vigente y mantiene la base actualizada.

## Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Arrancar servidor de desarrollo
npm run dev
```

El frontend corre en `http://localhost:5173` y redirige `/api` al backend automáticamente.

## Tests

```bash
cd backend
source venv/bin/activate

python3 -c "
import os, sys; os.environ['DJANGO_SETTINGS_MODULE']='finghorarios.settings'
import django; from django.conf import settings
settings.DATABASES={'default':{'ENGINE':'django.db.backends.sqlite3','NAME':':memory:'}}
django.setup()
from django.test.runner import DiscoverRunner
failures = DiscoverRunner(verbosity=2).run_tests(['tests'])
sys.exit(bool(failures))
"
```
