from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

import services
from .models import MainCycle, Boost
from .serializers import UserSerializer, UserSerializerDetail, CycleSerializer, CycleSerializerDetail, BoostSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CycleList(generics.ListAPIView):
    queryset = MainCycle.objects.all()
    serializer_class = CycleSerializer


class BoostList(generics.ListAPIView):
    queryset = Boost
    serializer_class = BoostSerializer

    def get_queryset(self):
        return Boost.objects.filter(mainCycle=self.kwargs['mainCycle'])


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializerDetail


class CycleDetail(generics.RetrieveAPIView):
    queryset = MainCycle.objects.all()
    serializer_class = CycleSerializerDetail


@api_view(['GET'])
def call_click(request):
    data = services.clicker_services.call_click(request)
    return Response(data)


@api_view(['POST'])
def buy_boost(request):
    click_power, coins_count, level, price, boost_power = services.clicker_services.buy_boost(request)
    return Response({'clickPower': click_power,
                     'coinsCount': coins_count,
                     'level': level,
                     'price': price,
                     'boost_power': boost_power})
