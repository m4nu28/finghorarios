from django.core.management.base import BaseCommand

from courses.scraper import download_pdf, find_pdf_urls, parse_pdf, save_to_db


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
            default=2026,
            help="Año del semestre (default: 2026)",
        )
        parser.add_argument(
            "--period",
            type=str,
            default="sem1",
            help="Periodo: sem1 o sem2 (default: sem1)",
        )

    def handle(self, *args, **options):
        url = options.get("url")
        year = options["year"]
        period = options["period"]

        if url:
            urls = [url]
        else:
            self.stdout.write("Buscando PDFs en la página de Bedelía...")
            urls = find_pdf_urls()
            if not urls:
                self.stdout.write(self.style.WARNING("No se encontraron PDFs"))
                return
            self.stdout.write(f"Encontrados {len(urls)} PDF(s)")

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

            result = save_to_db(courses_data, year, period, pdf_url)
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
