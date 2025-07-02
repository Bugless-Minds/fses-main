# views.py
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from fses.models import *
from django.db.models import Q
from fses.models import CustomUser
from django.core.mail import send_mail
from django.conf import settings
from authentication.models import PasswordReset
from django.contrib.auth.tokens import default_token_generator


@ensure_csrf_cookie
@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_csrf(request):
    return Response({'message': 'CSRF cookie set'})


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({'message': 'Login successful', 'session_id': request.session.session_key, 'role': user.role, 'is_first_time': user.is_first_time})
    return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return Response({'id':request.user.id, 'username': request.user.username, 'role': request.user.role, 'is_first_time': request.user.is_first_time})
    return Response({'error': 'Not authenticated'}, status=401)


@ensure_csrf_cookie
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Not authenticated'}, status=401)
    
    user = request.user
    username = request.data.get('username')
    password = request.data.get('new_password')
    
    if username:
        user.username = username
    if password:
        user.set_password(password)

    user.is_first_time = False
    
    user.save()
    
    return Response({'message': 'User updated successfully', 'role': user.role, 'is_first_time': user.is_first_time})


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def generate_password_reset_code(request):

    username = request.data.get('username')

    user = CustomUser.objects.filter(Q(username=username) | Q(email=username)).first()

    if not user:
        return Response({'error': 'User not found'}, status=404)
    
    reset_code = default_token_generator.make_token(user)

    password_reset = PasswordReset.objects.filter(user=user).first()
    if password_reset:
        password_reset.code = reset_code
        password_reset.save()
    else:
        password_reset = PasswordReset.objects.create(user=user, code=reset_code)
    
    print(user.email)

    send_mail(
        subject = 'FSES Password Reset',
        message = 'Your Password Reset Code'
        f'Hello {user.username}, your reset code is: {reset_code}'
        f'Click here to reset your password: http://localhost:5173/reset-password?code={reset_code}',
        from_email = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [user.email],
    )
    return Response({'message': 'Password reset code sent to your email'})

@api_view(['POST'])
@permission_classes([AllowAny])
def check_password_reset_code(request):
    code = request.data.get('code')

    password_reset = PasswordReset.objects.filter(code=code).first()

    if not password_reset:
        return Response({'error': 'Invalid reset code'}, status=400)

    return Response({'message': 'Valid reset code'})

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    code = request.data.get('code')
    new_password = request.data.get('new_password')

    password_reset = PasswordReset.objects.filter(code=code).first()

    if not password_reset:
        return Response({'error': 'Invalid reset code'}, status=400)

    user = password_reset.user
    user.set_password(new_password)
    user.save()

    password_reset.delete()
    return Response({'message': 'Password reset successfully, kindly login again'})