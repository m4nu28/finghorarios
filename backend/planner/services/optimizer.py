MAX_SOLUTIONS = 50


def rank_solutions(scored_solutions):
    sorted_solutions = sorted(
        scored_solutions,
        key=lambda s: (
            s["score"],
            -s["gap_minutes"],
            -s["days"],
        ),
        reverse=True,
    )
    return sorted_solutions[:MAX_SOLUTIONS]
