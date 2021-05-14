from django.contrib.auth.models import User
from django.db import models


class Boost(models.Model):
    power = models.IntegerField(default=1)
    price = models.IntegerField(default=10)

    def Upgrade(self):
        self.power *= 2
        self.price *= 2


class MainCycle(models.Model):
    user = models.OneToOneField(User, related_name='cycle', null=False, on_delete=models.CASCADE)
    coinsCount = models.IntegerField(default=0)
    clickPower = models.IntegerField(default=1)
    boost = models.ForeignKey(Boost, related_name='cycle', on_delete=models.CASCADE, null=True)

    def Click(self):
        self.coinsCount += self.clickPower


    def Upgrade(self):
        self.clickPower += self.boost.power
        self.coinsCount -= self.boost.price
