import itertools


def parse_group_type(group_number):
    upper = group_number.upper()
    if "TEORICO" in upper:
        return "teorico"
    elif "PRACTICO" in upper:
        return "practico"
    elif "COLABORATIVO" in upper:
        return "colaborativo"
    return "other"


def get_groups_by_course(courses_data):
    result = {}
    for course in courses_data:
        by_type = {}
        for group in course["groups"]:
            gtype = parse_group_type(group["group_number"])
            if gtype not in by_type:
                by_type[gtype] = []
            by_type[gtype].append({
                "group_number": group["group_number"],
                "course_name": course["name"],
                "meetings": [
                    {
                        "day": m["day"],
                        "start": m["start"],
                        "end": m["end"],
                        "room": m.get("room", ""),
                    }
                    for m in group["meetings"]
                ],
            })
        result[course["code"]] = {
            "name": course["name"],
            "by_type": by_type,
        }
    return result


def _make_course_choices(by_type, mode):
    teorico = by_type.get("teorico", [])
    practico = by_type.get("practico", [])
    colaborativo = by_type.get("colaborativo", [])
    other = by_type.get("other", [])

    has_teorico = len(teorico) > 0
    has_practico = len(practico) > 0

    if mode == "teorico" and has_teorico:
        return [[g] for g in teorico]
    if mode == "practico" and has_practico:
        return [[g] for g in practico]

    if has_teorico and has_practico:
        choices = []
        for t in teorico:
            for p in practico:
                choices.append([t, p])
        return choices

    if has_teorico:
        return [[g] for g in teorico]
    if has_practico:
        return [[g] for g in practico]
    if colaborativo:
        return [[g] for g in colaborativo]
    if other:
        return [[g] for g in other]
    return []


def generate_combinations(groups_by_course, course_types=None):
    if course_types is None:
        course_types = {}

    course_lists = []
    for course_code, info in groups_by_course.items():
        mode = course_types.get(course_code, "both")
        choices = _make_course_choices(info["by_type"], mode)
        if not choices:
            continue
        course_lists.append([(course_code, choice) for choice in choices])

    if not course_lists:
        return []
    return list(itertools.product(*course_lists))


def combination_to_meetings(combination):
    meetings = []
    for course_code, groups in combination:
        for group in groups:
            for meeting in group["meetings"]:
                meetings.append({
                    "course_code": course_code,
                    "course_name": group["course_name"],
                    "group_number": group["group_number"],
                    "day": meeting["day"],
                    "start": meeting["start"],
                    "end": meeting["end"],
                    "room": meeting.get("room", ""),
                })
    return meetings
