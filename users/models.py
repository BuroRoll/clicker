from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class MainCycle(models.Model):
    user = models.ForeignKey(User, related_name='cycle', null=False, on_delete=models.CASCADE)

    coinsCount = models.IntegerField(default=0)
    clickPower = models.IntegerField(default=1)
    level = models.IntegerField(default=0)

    def Click(self):
        self.coinsCount += self.clickPower
        return self.check_level()

    def check_level(self):
        if(self.coinsCount > (self.level**2 + 1) * 1000):
            self.level += 1
            boost = Boost(mainCycle = self, level = self.level)
            boost.save()
            return True
        return False


class Boost(models.Model):
    mainCycle = models.ForeignKey(MainCycle, related_name='boosts', null=False, on_delete=models.CASCADE)
    level = models.IntegerField(null=False)
    power = models.IntegerField(default=1)
    price = models.IntegerField(default=10)

    def upgrade(self):
        self.mainCycle.clickPower += self.power
        self.mainCycle.coinsCount -= self.price
        self.mainCycle.save()
        self.power *= 2
        self.price *= 2
        return (self.mainCycle.clickPower,
                self.level,
                self.price,
                self.power)
