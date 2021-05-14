from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect
from rest_framework import generics

from .forms import UserForm
from .models import MainCycle, Boost
from .serializers import UserSerializer, UserSerializerDetail, CycleSerializer, CycleSerializerDetail


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializerDetail


def index(request):
    user = User.objects.filter(id=request.user.id)
    if len(user) > 0:
        mainCycle = MainCycle.objects.filter(user=request.user)[0]
        return render(request, 'index.html', {'user': user[0], 'mainCycle': mainCycle})
    else:
        return render(request, 'login.html')


def callClick(request):
    user = User.objects.filter(id=request.user.id)
    serializer_class = UserSerializerDetail


class CycleList(generics.ListAPIView):
    queryset = MainCycle.objects.all()
    serializer_class = CycleSerializer


class CycleDetail(generics.RetrieveAPIView):
    queryset = MainCycle.objects.all()
    serializer_class = CycleSerializerDetail


def callClick(request):
    mainCycle = MainCycle.objects.filter(user=request.user)[0]
    mainCycle.Click()
    mainCycle.save()
    return HttpResponse(mainCycle.coinsCount)


def user_login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            return render(request, 'login.html', {'invalid': True})
    else:
        return render(request, 'login.html', {'invalid': False})


def user_logout(request):
    logout(request)
    return redirect('login')


def user_registration(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save()
            mainCycle = MainCycle()
            mainCycle.user = user
            mainCycle.save()
            user = authenticate(request, username=request.POST['username'], password=request.POST['password'])
            login(request, user)
            return redirect('index')
        else:
            return render(request, 'registration.html', {'invalid': True, 'form': form})
    else:
        form = UserForm()
        return render(request, 'registration.html', {'invalid': False, 'form': form})


@login_required
def buyBoost(request):
    mainCycle = MainCycle.objects.filter(user=request.user)[0]
    if mainCycle.boost is not None:
        mainCycle.Upgrade()
        mainCycle.save()
        mainCycle.boost.Upgrade()
        mainCycle.boost.save()
        mainCycle.save()
        return HttpResponse(mainCycle.clickPower)
    else:
        boost = Boost()
        mainCycle.boost = boost
        boost.save()
        mainCycle.save()
        mainCycle.Upgrade()
        return HttpResponse(mainCycle.clickPower)
