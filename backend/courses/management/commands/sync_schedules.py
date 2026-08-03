from django.core.management.base import BaseCommand

from courses.models import Course, ScheduleSource, Semester
from courses.scraper import (
    download_pdf,
    get_current_schedule_info,
    parse_pdf,
    pdf_hash,
    save_to_db,
)


class Command(BaseCommand):
    help = "Sincroniza horarios vigentes desde Bedelía si detecta PDFs nuevos o modificados."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Reimporta aunque los PDFs parezcan iguales a los ya importados.",
        )

    def handle(self, *args, **options):
        force = options["force"]
        info = get_current_schedule_info()
        year = info["year"]
        period = info["period"]
        urls = info["urls"]

        if not year or not period:
            self.stdout.write(self.style.ERROR("No se pudo detectar el semestre vigente en Bedelía."))
            return
        if not urls:
            self.stdout.write(self.style.WARNING("No se encontraron PDFs de horarios en Bedelía."))
            return

        semester, _ = Semester.objects.get_or_create(year=year, period=period)
        parsed_sources = []
        changed = force

        self.stdout.write(f"Semestre detectado: {year} {period}")
        self.stdout.write(f"PDFs encontrados: {len(urls)}")

        for url in urls:
            self.stdout.write(f"Descargando: {url}")
            pdf_bytes = download_pdf(url)
            digest = pdf_hash(pdf_bytes)
            file_name = url.split("/")[-1]
            source = ScheduleSource.objects.filter(
                semester=semester,
                source_type="pdf",
                file_name=file_name,
                notes__contains=f"sha256={digest}",
            ).first()
            if not source:
                changed = True

            courses_data = parse_pdf(pdf_bytes)
            if not courses_data:
                self.stdout.write(self.style.WARNING(f"No se detectaron materias en {file_name}"))
            parsed_sources.append((url, digest, courses_data))

        if not changed:
            self.stdout.write(self.style.SUCCESS("Horarios ya actualizados. No hay cambios."))
            return

        if not any(courses_data for _, _, courses_data in parsed_sources):
            self.stdout.write(self.style.ERROR("No se importó nada: ningún PDF produjo materias."))
            return

        deleted, _ = Course.objects.filter(semester=semester).delete()
        ScheduleSource.objects.filter(semester=semester, source_type="pdf").delete()
        self.stdout.write(f"Registros previos eliminados: {deleted}")

        total = {"courses": 0, "groups": 0, "meetings": 0}
        for url, digest, courses_data in parsed_sources:
            result = save_to_db(courses_data, year, period, url, digest)
            total["courses"] += result["courses"]
            total["groups"] += result["groups"]
            total["meetings"] += result["meetings"]

        self.stdout.write(
            self.style.SUCCESS(
                f"Sincronización completa: {total['courses']} materias, "
                f"{total['groups']} grupos, {total['meetings']} encuentros"
            )
        )
