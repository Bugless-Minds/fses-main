# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from ..serializers import *
from ..models import *



@api_view(['GET'])
def fetch_nominations(request):

    nominations = Nomination.objects.all()
    Serializer = nominationSerializer(nominations, many=True)
    return Response(Serializer.data)


@api_view(['GET'])
def fetch_nomination(request, id):
    try:
        nomination = Nomination.objects.get(id=id)
        Serializer = nominationSerializer(nomination)
        return Response(Serializer.data)
    except nomination.DoesNotExist:
        return Response({"error": "Nomination not found"}, status=404)
    

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def create_nomination(request):
    if request.method == 'POST':
        serializer = nominationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

@api_view(['PUT'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def update_nomination(request, id):
    try:
        nomination = Nomination.objects.get(id=id)
    except nomination.DoesNotExist:
        return Response({"error": "Nomination not found"}, status=404)

    if request.method == 'PUT':
        serializer = nominationSerializer(nomination, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def delete_nomination(request, id):
    try:
        nomination = Nomination.objects.get(id=id)
    except nomination.DoesNotExist:
        return Response({"error": "Nomination not found"}, status=404)

    if request.method == 'DELETE':
        nomination.delete()
        return Response(status=204)