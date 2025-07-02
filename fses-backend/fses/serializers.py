from rest_framework import serializers
from .models import *

class lecturerSerializer (serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = '__all__'


class nominationSerializer (serializers.ModelSerializer):
    class Meta:
        model = Nomination
        fields = '__all__'


class studentSerializer (serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class departmentSerializer (serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
