from django.urls import path
from . import views

urlpatterns = [

    path('', views.index, name="index"),
    path('click/', views.callClick, name="click"),
    path('login/', views.user_login, name="login" ),
    path('logout/', views.user_logout),
    path('registration/', views.user_registration, name="registration"),

    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('cycles/', views.CycleList.as_view()),
    path('cycles/<int:pk>/', views.CycleDetail.as_view()),
    path('click/', views.callClick, name="click"),
    path('buyBoost/', views.buyBoost, name="buyBoost"),
]
