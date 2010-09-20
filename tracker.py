import os
from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext.db import djangoforms

_DEBUG = True

class TrackerSong(db.Model):
	name = db.StringProperty(required=True)
	user = db.UserProperty()
	data = db.TextProperty()

class BaseRequestHandler(webapp.RequestHandler):
	"""Supplies a common template generation function.

	When you call generate(), we augment the template variables supplied with
	the current user in the 'user' variable and the current webapp request
	in the 'request' variable.
	"""
	def generate(self, template_name, template_values={}):
		values = {
			'request': self.request,
			'user': users.GetCurrentUser(),
			'login_url': users.CreateLoginURL(self.request.uri),
			'logout_url': users.CreateLogoutURL('http://' + self.request.host + '/'),
			'debug': self.request.get('deb'),
			'application_name': 'html5 tracker',
		}
		values.update(template_values)
		directory = os.path.dirname(__file__)
		path = os.path.join(directory, os.path.join('templates', template_name))
		self.response.out.write(template.render(path, values, debug=_DEBUG))

class SongList(BaseRequestHandler):
	def get(self):
		user = users.GetCurrentUser()
		if(user):
			songs = TrackerSong.all().filter('user =', user)
			self.generate('tracker/songs_list.html', {
				'songs': songs,
			})
		else:
			self.redirect(users.CreateLoginURL(self.request.uri))

class Song(BaseRequestHandler):
	def get(self, song_id):
		song = db.get(song_id)
		self.generate('tracker/song.html', {
			'song': song,
		})
	def post(self, song_id):
		user = users.GetCurrentUser()
		if(user):
			song = db.get(song_id)
			song.data = self.request.get('data')
			song.put()
		else:
			self.redirect(users.CreateLoginURL(self.request.uri))

class NewSong(BaseRequestHandler):
	def get(self):
		user = users.GetCurrentUser()
		song = TrackerSong(name=self.request.get('name'), user=user)
		song.put()
		self.response.out.write(song.key())

def main():
	application = webapp.WSGIApplication([
		('/tracker/', SongList),
		('/tracker/new_song', NewSong),
		(r'/tracker/(.*)', Song),
	], debug=_DEBUG)
	util.run_wsgi_app(application)

if __name__ == '__main__':
	main()