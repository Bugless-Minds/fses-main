from django.db import models
from fses.models import CustomUser


class PasswordReset(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    code = models.CharField()

    def __str__(self):
        return self.name