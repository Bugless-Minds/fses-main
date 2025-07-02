from django.urls import path
from fses.APIs.department import *
from fses.APIs.nomination import *
from fses.APIs.lecturer import *
from fses.APIs.student import *

urlpatterns = [
    # Lecturer URLs
    path('api/lecturers/', fetch_lecturers),
    path('api/lecturer/<int:id>/', fetch_lecturer),
    path('api/lecturer/create', create_lecturer),
    path('api/lecturer/update/<int:id>/', update_lecturer),
    path('api/lecturer/delete/<int:id>/', delete_lecturer),

    # Nomination URLs
    path('api/nominations/', fetch_nominations),
    path('api/nomination/<int:id>/', fetch_nomination),
    path('api/nomination/create', create_nomination),
    path('api/nomination/update/<int:id>/', update_nomination),
    path('api/nomination/delete/<int:id>/', delete_nomination),

    # Department URLs
    path('api/departments/', fetch_departments),
    path('api/department/<int:id>/', fetch_department),
    path('api/department/create', create_department),
    path('api/department/update/<int:id>/', update_department),
    path('api/department/delete/<int:id>/', delete_department),

    # Student URLs
    path('api/students/', fetch_students),
    path('api/student/<int:id>/', fetch_student),
    path('api/student/create', create_student),
    path('api/student/update/<int:id>/', update_student),
    path('api/student/delete/<int:id>/', delete_student),
]
