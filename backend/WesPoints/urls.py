from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^points/', 'WesPoints.views.points'),
    url(r'^calendar/', 'WesPoints.views.calendar'),
]
