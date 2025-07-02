from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from .models import CustomUser, Department, Lecturer, Student, Nomination


# Custom forms for handling creation and update of CustomUser in admin
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'role', 'is_first_time')


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'role', 'is_first_time')


# CustomUser admin class
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = ('username', 'email', 'role', 'is_first_time', 'is_staff', 'is_active')
    list_filter = ('role', 'is_first_time', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('User Role Info', {'fields': ('role', 'is_first_time')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets = ((None, {
        'classes': ('wide',),
        'fields': ('username', 'email', 'role', 'is_first_time', 'password1', 'password2'),
    }),)
    search_fields = ('username', 'email')
    ordering = ('username',)


# Your existing model admins
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "code")


class LecturerAdmin(admin.ModelAdmin):
    list_display = ("name", "department", "title", "university", "get_staff_username")

    def get_staff_username(self, obj):
        return obj.staff.username if obj.staff else "-"
    get_staff_username.short_description = "Staff Username"


class StudentAdmin(admin.ModelAdmin):
    list_display = ("name", "supervisor", "co_supervisor", "program", "evaluation_type")


class NominationAdmin(admin.ModelAdmin):
    list_display = ("student", "examiner1", "examiner2", "examiner3", "chairperson", "research_title", "is_locked")


# Register all models with admin
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Lecturer, LecturerAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Nomination, NominationAdmin)
