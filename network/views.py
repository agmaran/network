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
    logged_user = request.user
    if logged_user.is_authenticated:
        liked_posts = logged_user.liked_posts.all()
        return JsonResponse({'current_user': request.user.username, 'posts': [post.serialize() for post in posts], 'liked_posts': [post.serialize() for post in liked_posts]}, safe=False)
    else:
        return JsonResponse({'current_user': request.user.username, 'posts': [post.serialize() for post in posts], 'liked_posts': None}, safe=False)


def profile(request, username, page_num):
    user = User.objects.get(username=username)
    followers = Follow.objects.filter(following=user)
    following = Follow.objects.filter(follower=user)
    button = "your_profile"
    if (request.user.is_authenticated):
        if (Follow.objects.filter(follower=request.user, following=user).count() == 1):
            button = "unfollow"
        elif request.user != user:
            button = "follow"
    else:
        button = "follow"
    posts = user.my_posts.all()
    posts = posts.order_by("-timestamp").all()
    post_paginator = Paginator(posts, 10)
    page = post_paginator.get_page(page_num)
    return render(request, "network/profile.html", {
        "user_profile": user,
        "followers": len(followers),
        "following": len(following),
        "page": page,
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
    follow = Follow.objects.get(follower=follower, following=following)
    follow.delete()
    return JsonResponse({"message": "You are no longer following this user."})


def following(request, page_num):
    follows = Follow.objects.filter(follower=request.user)
    message = ''
    if not follows:
        message = "You don't follow any users."
    following = []
    for follow in follows:
        following.append(follow.following)
    posts = Post.objects.filter(poster__in=following)
    posts = posts.order_by("-timestamp").all()
    post_paginator = Paginator(posts, 10)
    page = post_paginator.get_page(page_num)
    if not posts and follows:
        message = "The users that you follow have not made any posts yet."
    return render(request, "network/following.html", {
        "page": page,
        "message": message
    })


@csrf_exempt
def editpost(request):
    data = json.loads(request.body)
    if data.get("content") == "":
        return JsonResponse({
            "error": "There should be some content in your post."
        }, status=400)
    else:
        post = Post.objects.get(pk=data.get("post_id"))
        post.content = data.get("content")
        post.save()
        return JsonResponse({"message": "Post saved."}, status=201)


@csrf_exempt
def like(request):
    if request.user.is_authenticated:
        data = json.loads(request.body)
        post = Post.objects.get(pk=data.get("post_id"))
        user = User.objects.get(pk=request.user.id)
        post.likes.add(user)
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp").all()
        liked_posts = user.liked_posts.all()
        return JsonResponse({'posts': [post.serialize() for post in posts], 'liked_posts': [post.serialize() for post in liked_posts]}, safe=False)
    else:
        return JsonResponse({'error': "user not authenticated"})


@csrf_exempt
def likes(request):
    if request.user.is_authenticated:
        data = json.loads(request.body)
        post = Post.objects.get(pk=data.get("post_id"))
        user = User.objects.get(pk=request.user.id)
        post.likes.add(user)
        return JsonResponse({'post': post.serialize(), 'liked': True})
    else:
        return JsonResponse({'error': "user not authenticated"})


@csrf_exempt
@login_required(login_url="login")
def unlike(request):
    data = json.loads(request.body)
    post = Post.objects.get(pk=data.get("post_id"))
    user = User.objects.get(pk=request.user.id)
    post.likes.remove(user)
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()
    liked_posts = user.liked_posts.all()
    return JsonResponse({'posts': [post.serialize() for post in posts], 'liked_posts': [post.serialize() for post in liked_posts]}, safe=False)


@csrf_exempt
@login_required(login_url="login")
def unlikes(request):
    data = json.loads(request.body)
    post = Post.objects.get(pk=data.get("post_id"))
    user = User.objects.get(pk=request.user.id)
    post.likes.remove(user)
    return JsonResponse({'post': post.serialize(), 'liked': False})


@csrf_exempt
def post(request):
    data = json.loads(request.body)
    post = Post.objects.get(pk=data.get("post_id"))
    if request.user.is_authenticated:
        user = User.objects.get(pk=request.user.id)
        if user in post.likes.all():
            liked = True
        else:
            liked = False
    else:
        liked = False
    return JsonResponse({'post': post.serialize(), 'liked': liked})
