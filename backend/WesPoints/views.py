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
    output = subprocess.check_output(['phantomjs', 'WesPoints/get_points.js', username, pwd])
    results = output.decode('utf-8').split("\n")
    return HttpResponse(json.dumps({ 'meals': int(results[0]), 'points': float(results[1].split(' ')[0]) }), content_type='application/json')
