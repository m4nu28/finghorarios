from datetime import time


def calculate_score(meetings, preferences, busy_blocks=None):
    if busy_blocks is None:
        busy_blocks = []

    positives = []
    negatives = []
    score = 100

    active_days = sorted(set(m["day"] for m in meetings))
    fixed_days = sorted(set(b["day"] for b in busy_blocks if b.get("fixed")))
    all_days = sorted(set(active_days + fixed_days))
    num_days = len(all_days)

    max_days = preferences.get("max_days", 6)
    if num_days <= max_days:
        positives.append(f"Solo {num_days} día{'s' if num_days != 1 else ''}")
        score += (max_days - num_days) * 5
    else:
        negatives.append(f"{num_days} días activos (querías máximo {max_days})")
        score -= (num_days - max_days) * 10

    avoid_friday = preferences.get("avoid_friday", False)
    if avoid_friday:
        if 4 not in all_days:
            positives.append("Sin viernes")
            score += 10
        else:
            negatives.append("Incluye viernes")
            score -= 15

    avoid_saturday = preferences.get("avoid_saturday", False)
    if avoid_saturday:
        if 5 not in all_days:
            positives.append("Sin sábado")
            score += 5
        else:
            negatives.append("Incluye sábado")
            score -= 10

    gaps = _calculate_gaps(meetings, active_days, busy_blocks)
    total_gap_minutes = sum(g["minutes"] for g in gaps)
    max_gap_minutes = max((g["minutes"] for g in gaps), default=0)

    if total_gap_minutes == 0:
        positives.append("Sin tiempo muerto")
    elif max_gap_minutes <= 15:
        positives.append(f"Mínimos huecos ({total_gap_minutes}m total)")
    elif max_gap_minutes <= 60:
        positives.append(f"Pequeños huecos ({total_gap_minutes}m total)")
    elif total_gap_minutes <= 180:
        negatives.append(f"Huecos sumando {total_gap_minutes}m en total")
        score -= 10
    else:
        negatives.append(f"Huecos sumando {total_gap_minutes}m en total")
        score -= 20

    first_start, last_end = _get_bounds(meetings)
    preferred_periods = preferences.get("preferred_periods", [])

    if preferred_periods:
        matched = False
        for period in preferred_periods:
            if period == "morning" and first_start >= time(7, 0) and last_end <= time(14, 0):
                positives.append("Horario matutino")
                score += 10
                matched = True
                break
            elif period == "afternoon" and first_start >= time(12, 0) and last_end <= time(19, 0):
                positives.append("Horario vespertino")
                score += 10
                matched = True
                break
            elif period == "night" and first_start >= time(17, 0):
                positives.append("Horario nocturno")
                score += 10
                matched = True
                break
        if not matched:
            period_labels = {"morning": "matutino", "afternoon": "vespertino", "night": "nocturno"}
            labels = " o ".join(period_labels.get(p, p) for p in preferred_periods)
            negatives.append(f"No coincide con horario {labels}")
            score -= 10

    if gaps:
        longest = max(gaps, key=lambda g: g["minutes"])
        if longest["minutes"] > 90:
            day_name = _DAY_NAMES[longest["day"]]
            negatives.append(f"Hueco largo el {day_name}: {longest['minutes']} min en total")

    score = max(0, min(100, score))

    gap_detail = []
    for g in gaps:
        gap_detail.append({
            "day": g["day"],
            "day_name": _DAY_NAMES[g["day"]],
            "start": g["start"].strftime("%H:%M"),
            "end": g["end"].strftime("%H:%M"),
            "minutes": g["minutes"],
        })

    return {
        "score": score,
        "days": num_days,
        "gap_minutes": total_gap_minutes,
        "gap_detail": gap_detail,
        "first_start": first_start.strftime("%H:%M"),
        "last_end": last_end.strftime("%H:%M"),
        "positives": positives,
        "negatives": negatives,
    }


_DAY_NAMES = {
    0: "Lunes",
    1: "Martes",
    2: "Miércoles",
    3: "Jueves",
    4: "Viernes",
    5: "Sábado",
}


def _calculate_gaps(meetings, active_days, busy_blocks):
    gaps = []
    for day in active_days:
        day_meetings = sorted(
            [m for m in meetings if m["day"] == day],
            key=lambda m: m["start"],
        )
        day_blocks = [b for b in busy_blocks if b["day"] == day]

        for i in range(len(day_meetings) - 1):
            gap_start = day_meetings[i]["end"]
            gap_end = day_meetings[i + 1]["start"]
            gap_minutes = _time_diff_minutes(gap_start, gap_end)
            if gap_minutes <= 0:
                continue

            busy_in_gap = _subtract_busy(gap_start, gap_end, day_blocks)
            free_minutes = gap_minutes - busy_in_gap

            if free_minutes > 0:
                gaps.append({
                    "day": day,
                    "start": gap_start,
                    "end": gap_end,
                    "minutes": free_minutes,
                })
    return gaps


def _subtract_busy(gap_start, gap_end, day_blocks):
    total_busy = 0
    for block in day_blocks:
        b_start = max_time(gap_start, block["start"])
        b_end = min_time(gap_end, block["end"])
        overlap = _time_diff_minutes(b_start, b_end)
        if overlap > 0:
            total_busy += overlap
    return min(total_busy, _time_diff_minutes(gap_start, gap_end))


def max_time(t1, t2):
    return t1 if (t1.hour * 60 + t1.minute) >= (t2.hour * 60 + t2.minute) else t2


def min_time(t1, t2):
    return t1 if (t1.hour * 60 + t1.minute) <= (t2.hour * 60 + t2.minute) else t2


def _get_bounds(meetings):
    if not meetings:
        return time(0, 0), time(0, 0)
    first_start = min(m["start"] for m in meetings)
    last_end = max(m["end"] for m in meetings)
    return first_start, last_end


def _time_diff_minutes(t1, t2):
    return (t2.hour * 60 + t2.minute) - (t1.hour * 60 + t1.minute)
