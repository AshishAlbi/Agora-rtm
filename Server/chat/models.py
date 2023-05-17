from django.db import models

# Create your models here.
class chat(models.Model):
    id=models.AutoField(primary_key=True)
    text = models.CharField(max_length=2500)
    uid = models.CharField(max_length=500)
    dateTime = models.DateTimeField()
    channelName = models.CharField(max_length=500)
    class Meta:
        db_table = 'Chat'