from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect
import subprocess
import json

def points(request):
    username = request.GET.get('username',request.POST.get('username'))
    pwd = request.GET.get('password',request.POST.get('password'))
    if not username or not pwd:
        return HttpResponse(status=400)
    output = subprocess.check_output(['phantomjs', '/srv/weshack/WesPoints/backend/WesPoints/get_points.js', username, pwd])
    results = output.decode('utf-8').split("\n")
    return HttpResponse(json.dumps({ 'meals': int(results[0]), 'points': float(results[1].split(' ')[0]), 'plan_meals': int(results[2]), 'plan_points': int(results[3]), 'guest_meals': int(results[4]) }), content_type='application/json')

def calendar(request):
  return HttpResponse(json.dumps({
    "start": "September 5, 2015",
    "end": "December 20, 2015",
    "breaks": [
      {
        "name": "Fall Break",
        "start": "October 24, 2015",
        "end": "October 27, 2015"
      },
      {
        "name": "Thanksgiving",
        "start": "November 25, 2015",
        "end": "November 29, 2015"
      }
    ]
  }), content_type='application/json')
