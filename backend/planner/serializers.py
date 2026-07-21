import re

from rest_framework import serializers

TIME_RE = re.compile(r"^\d{1,2}:\d{2}$")


class BusyBlockSerializer(serializers.Serializer):
    day = serializers.IntegerField(min_value=0, max_value=4)
    start = serializers.CharField()
    end = serializers.CharField()
    reason = serializers.CharField(required=False, default=None, allow_blank=True, allow_null=True)

    def validate_start(self, value):
        if not TIME_RE.match(value):
            raise serializers.ValidationError("Formato inválido. Usá HH:MM (ej: 08:30).")
        h, m = value.split(":")
        if int(h) > 23 or int(m) > 59:
            raise serializers.ValidationError("Hora fuera de rango.")
        return value

    def validate_end(self, value):
        if not TIME_RE.match(value):
            raise serializers.ValidationError("Formato inválido. Usá HH:MM (ej: 10:00).")
        h, m = value.split(":")
        if int(h) > 23 or int(m) > 59:
            raise serializers.ValidationError("Hora fuera de rango.")
        return value


class PreferencesSerializer(serializers.Serializer):
    max_days = serializers.IntegerField(default=5, min_value=1, max_value=6, required=False, allow_null=True)
    avoid_friday = serializers.BooleanField(default=False, required=False)
    avoid_saturday = serializers.BooleanField(default=False, required=False)
    preferred_periods = serializers.ListField(
        child=serializers.ChoiceField(choices=["morning", "afternoon", "night"]),
        default=[],
        required=False,
    )


class GenerateRequestSerializer(serializers.Serializer):
    course_codes = serializers.ListField(
        child=serializers.CharField(), min_length=1, max_length=10
    )
    busy_blocks = BusyBlockSerializer(many=True, default=[])
    preferences = PreferencesSerializer(default={})
    course_types = serializers.DictField(
        child=serializers.ChoiceField(choices=["both", "teorico", "practico"]),
        default={},
        required=False,
    )
