from django.urls import path
from .views import *

from . import views

urlpatterns = [
    path('csrf/', get_csrf),
    path('login/', login_view),
    path('logout/', logout_view),
    path('user/', current_user),
    path('update/', update_user),
    path('generate-reset-code/', generate_password_reset_code),
    path('confirm-reset-code/', check_password_reset_code),
    path('reset-password/', reset_password),
]
