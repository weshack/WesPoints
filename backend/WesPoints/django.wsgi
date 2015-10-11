import os
import sys

activate_this = '/srv/venv/wespoints.weshack.com/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

sys.path.append('/srv/weshack/WesPoints/backend/')

os.environ['DJANGO_SETTINGS_MODULE'] = 'WesPoints.settings'
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
