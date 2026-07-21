import re
from datetime import time

import fitz
import requests
from bs4 import BeautifulSoup

from courses.models import Course, CourseGroup, Meeting, ScheduleSource, Semester

BASE_URL = "https://www.fing.edu.uy"
HORARIOS_PAGE = f"{BASE_URL}/es/bedelia/horarios"

DAY_MAP = {
    "Lunes": 0,
    "Martes": 1,
    "Miércoles": 2,
    "Jueves": 3,
    "Viernes": 4,
    "Sábado": 5,
}


def find_pdf_urls():
    resp = requests.get(HORARIOS_PAGE, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    urls = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.endswith(".pdf") and "horario" in href.lower():
            if not href.startswith("http"):
                href = BASE_URL + href
            urls.append(href)
    return urls


def download_pdf(url):
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    return resp.content


def parse_time_range(text):
    match = re.search(r"(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})", text)
    if not match:
        return None, None
    start_parts = match.group(1).split(":")
    end_parts = match.group(2).split(":")
    return time(int(start_parts[0]), int(start_parts[1])), time(int(end_parts[0]), int(end_parts[1]))


def parse_room(text):
    lines = text.strip().split("\n")
    if len(lines) > 1:
        return lines[1].strip()
    return ""


GROUP_TYPE_RE = re.compile(
    r"(PRACTICO|TEORICO|COLABORATIVO)\s+(GRUPO\s*\d+)", re.IGNORECASE
)


def _find_first_data_row(data):
    for row in data:
        if row and row[0]:
            cell0 = row[0].strip()
            if cell0 and cell0 != "Grupo" and not cell0.startswith("Instituto:"):
                return cell0
    return None


def _extract_group_from_cell(cell0):
    lines = cell0.strip().split("\n")
    for i, line in enumerate(lines):
        m = GROUP_TYPE_RE.search(line)
        if m:
            group_type = m.group(1).upper()
            group_num = m.group(2).upper().replace("  ", " ").strip()
            group_number = f"{group_type} {group_num.split('GRUPO')[-1].strip()}"
            group_number = f"{group_type} GRUPO {group_num.split('GRUPO')[-1].strip()}"
            name_lines = []
            for nl in lines[:i]:
                nl = nl.strip()
                if nl and nl != "_":
                    name_lines.append(nl)
            name = " ".join(name_lines) if name_lines else None
            return name, group_number
    return None, None


def parse_pdf(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    courses = {}
    current_course_code = None
    current_course_name = None

    for page in doc:
        text = page.get_text()
        if _has_talleres_header_text(text):
            _parse_format_talleres_text(text, courses)
            continue

        tables = page.find_tables()
        if not tables.tables:
            continue

        for table in tables.tables:
            data = table.extract()
            has_asignatura = any(
                row[0] and row[0].strip().startswith("Asignatura:")
                for row in data
                if row and row[0]
            )

            if has_asignatura:
                current_course_code, current_course_name = _parse_format_engineering(
                    data, courses, current_course_code, current_course_name
                )
            else:
                first_group_row = _find_first_data_row(data)
                if first_group_row and re.match(
                    r"(PRACTICO|TEORICO|COLABORATIVO)",
                    first_group_row,
                    re.IGNORECASE,
                ):
                    current_course_code, current_course_name = _parse_format_engineering(
                        data, courses, current_course_code, current_course_name
                    )
                else:
                    _parse_format_inline(data, courses)

    doc.close()
    return list(courses.values())


def _parse_format_engineering(data, courses, current_course_code, current_course_name):
    for row in data:
        if not row or not row[0]:
            continue

        cell0 = row[0].strip()

        if cell0.startswith("Asignatura:"):
            header = cell0.replace("Asignatura:", "").strip()
            code_match = re.match(r"(.+?)\s+-\s+(.+)", header)
            if code_match:
                current_course_code = code_match.group(1).strip().replace(" ", "-")
                current_course_name = code_match.group(2).strip()
                if current_course_code not in courses:
                    courses[current_course_code] = {
                        "code": current_course_code,
                        "name": current_course_name,
                        "groups": {},
                    }
            continue

        if cell0 == "Grupo":
            continue

        if current_course_code and re.match(
            r"(PRACTICO|TEORICO|COLABORATIVO)", cell0, re.IGNORECASE
        ):
            group_key = cell0.strip()
            if group_key not in courses[current_course_code]["groups"]:
                courses[current_course_code]["groups"][group_key] = {
                    "group_number": group_key,
                    "meetings": [],
                }

            _extract_meetings_from_row(
                row, courses[current_course_code]["groups"][group_key]
            )

    return current_course_code, current_course_name


def _derive_code(name):
    words = name.upper().split()
    if not words:
        return "UNKNOWN"
    code_words = []
    for w in words:
        cleaned = re.sub(r"[^A-Z0-9]", "", w)
        if cleaned:
            code_words.append(cleaned)
    return "_".join(code_words[:4])


def _parse_format_inline(data, courses):
    for row in data:
        if not row or not row[0]:
            continue

        cell0 = row[0].strip()

        if cell0 == "Grupo" or cell0.startswith("Instituto:"):
            continue

        _, group_number = _extract_group_from_cell(cell0)
        if not group_number:
            continue

        # Extract course name from cell0
        lines = cell0.strip().split("\n")
        name_lines = []
        for line in lines:
            line_stripped = line.strip()
            if not line_stripped or line_stripped == "_":
                continue
            if GROUP_TYPE_RE.search(line_stripped):
                break
            name_lines.append(line_stripped)

        course_name = " ".join(name_lines) if name_lines else group_number

        # Derive a code from the name
        code = _derive_code(course_name)

        if code not in courses:
            courses[code] = {
                "code": code,
                "name": course_name,
                "groups": {},
            }

        if group_number not in courses[code]["groups"]:
            courses[code]["groups"][group_number] = {
                "group_number": group_number,
                "meetings": [],
            }

        _extract_meetings_from_row(row, courses[code]["groups"][group_number])


def _has_talleres_header(data):
    for row in data:
        if not row:
            continue
        for cell in row:
            if cell and "Taller" in str(cell):
                return True
    return False


def _has_talleres_header_text(text):
    return "Taller" in text and ("TIM" in text or "Tecnólogo" in text)


GROUP_SCHEDULE_RE = re.compile(
    r"G(\d+):\s*(\w+)\s+de\s+(\d{1,2}:\d{2})\s+a\s+(\d{1,2}:\d{2})"
)


def _parse_format_talleres_text(text, courses):
    lines = text.split("\n")
    current_code = None
    current_name = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        tim_match = re.match(r"^(TIM\s*\d+)\s*$", line)
        if tim_match:
            current_code = tim_match.group(1).replace(" ", "")
            current_name = None
            if current_code not in courses:
                courses[current_code] = {
                    "code": current_code,
                    "name": current_code,
                    "groups": {},
                }
            continue

        taller_match = re.match(r"^(Taller\s*\d+\s*:\s*.+)", line)
        if taller_match and current_code:
            current_name = taller_match.group(1).strip()
            courses[current_code]["name"] = current_name
            continue

        if current_code:
            for gmatch in GROUP_SCHEDULE_RE.finditer(line):
                gnum, day_name, start_str, end_str = gmatch.groups()
                g_key = f"GRUPO {gnum}"
                if g_key not in courses[current_code]["groups"]:
                    courses[current_code]["groups"][g_key] = {
                        "group_number": g_key,
                        "meetings": [],
                    }
                day_name_cap = day_name.capitalize()
                if day_name_cap in DAY_MAP:
                    start_h, start_m = start_str.split(":")
                    end_h, end_m = end_str.split(":")
                    courses[current_code]["groups"][g_key]["meetings"].append({
                        "day": DAY_MAP[day_name_cap],
                        "start": time(int(start_h), int(start_m)),
                        "end": time(int(end_h), int(end_m)),
                        "room": current_code,
                    })


def _extract_meetings_from_row(row, group_dict):
    day_names = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    for day_idx, day_name in enumerate(day_names):
        cell = row[day_idx + 1] if day_idx + 1 < len(row) else ""
        if not cell or not cell.strip():
            continue

        start_time, end_time = parse_time_range(cell)
        if not start_time:
            continue

        room = parse_room(cell)
        group_dict["meetings"].append(
            {
                "day": DAY_MAP[day_name],
                "start": start_time,
                "end": end_time,
                "room": room,
            }
        )


def save_to_db(courses_data, semester_year, semester_period, source_url=""):
    semester, _ = Semester.objects.get_or_create(
        year=semester_year, period=semester_period
    )

    source = None
    if source_url:
        source, _ = ScheduleSource.objects.get_or_create(
            semester=semester,
            source_type="pdf",
            file_name=source_url.split("/")[-1],
            defaults={"notes": f"Scraped from {source_url}"},
        )

    created_courses = 0
    created_groups = 0
    created_meetings = 0

    for course_data in courses_data:
        course, created = Course.objects.get_or_create(
            code=course_data["code"],
            semester=semester,
            defaults={"name": course_data["name"]},
        )
        if created:
            created_courses += 1

        for group_data in course_data["groups"].values():
            group, created = CourseGroup.objects.get_or_create(
                course=course,
                group_number=group_data["group_number"],
            )
            if created:
                created_groups += 1

            for meeting_data in group_data["meetings"]:
                _, created = Meeting.objects.get_or_create(
                    group=group,
                    day=meeting_data["day"],
                    start_time=meeting_data["start"],
                    end_time=meeting_data["end"],
                    defaults={"room": meeting_data["room"]},
                )
                if created:
                    created_meetings += 1

    return {
        "semester": str(semester),
        "courses": created_courses,
        "groups": created_groups,
        "meetings": created_meetings,
    }
