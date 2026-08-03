from django.core.management.base import BaseCommand

from courses.models import Course, Semester
from courses.scraper import (
    download_pdf,
    find_pdf_urls,
    get_current_schedule_info,
    parse_pdf,
    pdf_hash,
    save_to_db,
)


class Command(BaseCommand):
    help = "Importa horarios desde los PDFs de Bedelía (fing.edu.uy)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--url",
            type=str,
            help="URL directa del PDF (ignora scraping de la página)",
        )
        parser.add_argument(
            "--year",
            type=int,
            default=None,
            help="Año del semestre. Si se omite, se detecta desde Bedelía.",
        )
        parser.add_argument(
            "--period",
            type=str,
            default=None,
            help="Periodo: sem1 o sem2. Si se omite, se detecta desde Bedelía.",
        )
        parser.add_argument(
            "--replace-semester",
            action="store_true",
            help="Borra materias del semestre antes de importar para evitar horarios obsoletos.",
        )

    def handle(self, *args, **options):
        url = options.get("url")
        year = options["year"]
        period = options["period"]
        replace_semester = options["replace_semester"]

        if url:
            urls = [url]
        else:
            self.stdout.write("Buscando PDFs en la página de Bedelía...")
            info = get_current_schedule_info()
            urls = info["urls"] or find_pdf_urls()
            year = year or info["year"]
            period = period or info["period"]
            if not urls:
                self.stdout.write(self.style.WARNING("No se encontraron PDFs"))
                return
            self.stdout.write(f"Encontrados {len(urls)} PDF(s)")

        if not year or not period:
            self.stdout.write(self.style.ERROR("No se pudo determinar año/período. Usá --year y --period."))
            return

        if replace_semester:
            semester, _ = Semester.objects.get_or_create(year=year, period=period)
            deleted, _ = Course.objects.filter(semester=semester).delete()
            self.stdout.write(f"Semestre {year} {period}: eliminados {deleted} registros previos")

        total = {"courses": 0, "groups": 0, "meetings": 0}

        for pdf_url in urls:
            self.stdout.write(f"\nDescargando: {pdf_url}")
            try:
                pdf_bytes = download_pdf(pdf_url)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error descargando: {e}"))
                continue

            self.stdout.write("Parseando PDF...")
            courses_data = parse_pdf(pdf_bytes)
            self.stdout.write(f"Encontradas {len(courses_data)} materias")

            result = save_to_db(courses_data, year, period, pdf_url, pdf_hash(pdf_bytes))
            total["courses"] += result["courses"]
            total["groups"] += result["groups"]
            total["meetings"] += result["meetings"]

            self.stdout.write(
                self.style.SUCCESS(
                    f"Guardado: {result['courses']} materias, "
                    f"{result['groups']} grupos, "
                    f"{result['meetings']} encuentros"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nTotal: {total['courses']} materias nuevas, "
                f"{total['groups']} grupos nuevos, "
                f"{total['meetings']} encuentros nuevos"
            )
        )
