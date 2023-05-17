from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from datetime import datetime
from .models import chat

# Create your views here.

# @csrf_exempt
@api_view(['POST'])
def save(request):
    chat.objects.create(text=request.data['text'],uid=request.data['uid'],channelName=request.data['channelName'],dateTime=datetime.now())
    return JsonResponse(data="succcess",status=status.HTTP_200_OK,safe=False)
