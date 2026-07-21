from .combinations import combination_to_meetings, generate_combinations, get_groups_by_course
from .conflicts import busy_blocks_conflict, combination_has_conflict
from .optimizer import rank_solutions
from .scoring import calculate_score


def generate(courses_data, busy_blocks=None, preferences=None, course_types=None):
    if busy_blocks is None:
        busy_blocks = []
    if preferences is None:
        preferences = {}

    groups_by_course = get_groups_by_course(courses_data)
    raw_combinations = generate_combinations(groups_by_course, course_types)

    solutions = []

    for combination in raw_combinations:
        meetings = combination_to_meetings(combination)

        if combination_has_conflict(meetings):
            continue

        if busy_blocks and busy_blocks_conflict(meetings, busy_blocks):
            continue

        result = calculate_score(meetings, preferences, busy_blocks)

        solution_groups = []
        for course_code, groups in combination:
            for group in groups:
                solution_groups.append({
                    "course_code": course_code,
                    "group_number": group["group_number"],
                })

        solutions.append({
            "score": result["score"],
            "days": result["days"],
            "gap_minutes": result["gap_minutes"],
            "gap_detail": result["gap_detail"],
            "first_start": result["first_start"],
            "last_end": result["last_end"],
            "positives": result["positives"],
            "negatives": result["negatives"],
            "groups": solution_groups,
            "meetings": meetings,
        })

    ranked = rank_solutions(solutions)

    return {
        "total_combinations": len(raw_combinations),
        "valid_combinations": len(solutions),
        "solutions": ranked,
    }
