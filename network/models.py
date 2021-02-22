from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    poster = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="my_posts")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return f"{self.poster} posted: {self.content}"
