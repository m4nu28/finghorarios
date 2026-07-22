from datetime import time


def times_overlap(start_a, end_a, start_b, end_b):
    return start_a < end_b and start_b < end_a


def meetings_overlap(meeting_a, meeting_b):
    if meeting_a["day"] != meeting_b["day"]:
        return False
    return times_overlap(
        meeting_a["start"],
        meeting_a["end"],
        meeting_b["start"],
        meeting_b["end"],
    )


def combination_has_conflict(combination_meetings):
    for i in range(len(combination_meetings)):
        for j in range(i + 1, len(combination_meetings)):
            if meetings_overlap(combination_meetings[i], combination_meetings[j]):
                return True
    return False


def busy_blocks_conflict(meetings, busy_blocks):
    parsed_blocks = [
        {"day": b["day"], "start": _parse_time(b["start"]), "end": _parse_time(b["end"])}
        for b in busy_blocks
    ]
    for meeting in meetings:
        for block in parsed_blocks:
            if meeting["day"] == block["day"]:
                if times_overlap(meeting["start"], meeting["end"], block["start"], block["end"]):
                    return True
    return False


def _parse_time(time_str):
    if isinstance(time_str, time):
        return time_str
    parts = time_str.split(":")
    return time(int(parts[0]), int(parts[1]))
