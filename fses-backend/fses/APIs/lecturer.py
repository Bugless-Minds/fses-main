# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.hashers import make_password
from ..serializers import *
from ..models import *



@api_view(['GET'])
def fetch_lecturers(request):

    lecturers = Lecturer.objects.all()
    Serializer = lecturerSerializer(lecturers, many=True)
    return Response(Serializer.data)


@api_view(['GET'])
def fetch_lecturer(request, id):
    try:
        lecturer = Lecturer.objects.get(id=id)
        Serializer = lecturerSerializer(lecturer)
        return Response(Serializer.data)
    except Lecturer.DoesNotExist:
        return Response({"error": "Lecturer not found"}, status=404)
    

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def create_lecturer(request):
    if request.method == 'POST':
        serializer = lecturerSerializer(data=request.data)
        if serializer.is_valid():

            lecturer_data = serializer.validated_data
            # Create CustomUser for this lecturer
            splitName = lecturer_data['name'].split(' ')
            username = splitName[len(splitName) - 1].lower()  # Use first name as username
            email = f"{username}@utm.my"
            default_password = make_password(username)  # Default password

            user = CustomUser.objects.create(
                username=username,
                email=email,
                password=default_password,
                role=CustomUser.SUPERVISOR,
                is_first_time=True
            )
            serializer.save(staff=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

@api_view(['PUT'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def update_lecturer(request, id):
    try:
        lecturer = Lecturer.objects.get(id=id)
    except Lecturer.DoesNotExist:
        return Response({"error": "Lecturer not found"}, status=404)

    if request.method == 'PUT':
        serializer = lecturerSerializer(lecturer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def delete_lecturer(request, id):
    try:
        lecturer = Lecturer.objects.get(id=id)
    except Lecturer.DoesNotExist:
        return Response({"error": "Lecturer not found"}, status=404)

    if request.method == 'DELETE':
        lecturer.delete()
        return Response(status=204)