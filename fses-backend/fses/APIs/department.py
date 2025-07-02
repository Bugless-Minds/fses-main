# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from ..serializers import *
from ..models import *



@api_view(['GET'])
def fetch_departments(request):

    departments = Department.objects.all()
    Serializer = departmentSerializer(departments, many=True)
    return Response(Serializer.data)


@api_view(['GET'])
def fetch_department(request, id):
    try:
        department = Department.objects.get(id=id)
        Serializer = departmentSerializer(department)
        return Response(Serializer.data)
    except department.DoesNotExist:
        return Response({"error": "Department not found"}, status=404)
    

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def create_department(request):
    if request.method == 'POST':
        serializer = departmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

@api_view(['PUT'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def update_department(request, id):
    try:
        department = Department.objects.get(id=id)
    except department.DoesNotExist:
        return Response({"error": "Department not found"}, status=404)

    if request.method == 'PUT':
        serializer = departmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def delete_department(request, id):
    try:
        department = Department.objects.get(id=id)
    except department.DoesNotExist:
        return Response({"error": "Department not found"}, status=404)

    if request.method == 'DELETE':
        department.delete()
        return Response(status=204)