import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from .models import User, Post, Follow


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
def newpost(request):
    data = json.loads(request.body)
    if data.get("text") == "":
        return JsonResponse({
            "error": "There should be some content in your post."
        }, status=400)
    else:
        post = Post(
            poster=request.user,
            content=data.get("text")
        )
        post.save()
        return JsonResponse({"message": "Posted successfully."}, status=201)


def allposts(request):
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()
    return JsonResponse({'current_user': request.user.username, 'posts': [post.serialize() for post in posts]}, safe=False)


def profile(request, username):
    user = User.objects.get(username=username)
    followers = Follow.objects.filter(following=user)
    following = Follow.objects.filter(follower=user)
    if (request.user.is_authenticated):
        if (Follow.objects.filter(follower=request.user, following=user).count() == 1):
            button = "unfollow"
        else:
            button = "follow"
    else:
        button = "follow"
    posts = user.my_posts.all()
    posts = posts.order_by("-timestamp").all()
    return render(request, "network/profile.html", {
        "user_profile": user,
        "followers": len(followers),
        "following": len(following),
        "posts": posts,
        "button": button
    })


@csrf_exempt
@login_required(login_url="login")
def follow(request):
    data = json.loads(request.body)
    following = User.objects.get(username=data.get("username"))
    follower = request.user
    follow = Follow(follower=follower, following=following)
    follow.save()
    return JsonResponse({"message": "You are now following this user."})


@csrf_exempt
def unfollow(request):
    data = json.loads(request.body)
    following = User.objects.get(username=data.get("username"))
    follower = request.user
    follow = Follow.objects.filter(follower=follower, following=following)
    follow.delete()
    return JsonResponse({"message": "You are no longer following this user."})


def following(request):
    follows = Follow.objects.filter(follower=request.user)
    message = ''
    if not follows:
        message = "You don't follow any users."
    following = []
    for follow in follows:
        following.append(follow.following)
    posts = Post.objects.filter(poster__in=following)
    if not posts and follows:
        message = "The users that you follow have not made any posts yet."
    return render(request, "network/following.html", {
        "posts": posts,
        "message": message
    })
