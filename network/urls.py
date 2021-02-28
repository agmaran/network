
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newpost", views.newpost, name="newpost"),
    path("allposts", views.allposts, name="allposts"),
    path("<int:page_num>/<str:username>/profile", views.profile, name="profile"),
    path("follow", views.follow, name="follow"),
    path("unfollow", views.unfollow, name="unfollow"),
    path("<int:page_num>/following", views.following, name="following"),
    path("editpost", views.editpost, name="editpost"),
    path("like", views.like, name="like"),
    path("unlike", views.unlike, name="unlike"),
    path("post", views.post, name="post"),
    path("likes", views.likes, name="likes"),
    path("unlikes", views.unlikes, name="unlikes")
]
