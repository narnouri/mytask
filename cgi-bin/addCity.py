#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import cgi
import json
import MySQLdb
import sys

print "Content-type: text/html"
print

form = cgi.FieldStorage()

#database connection
cnx = MySQLdb.connect(user='root',passwd='7864',host='127.0.0.1',db='MyApp')
cursor = cnx.cursor()
cursor.execute('INSERT INTO Cities (description, country, lat, lng) VALUES (%s, %s, %s, %s)', (form.getvalue('city'), form.getvalue('country'), form.getvalue('lat'), form.getvalue('lng')))
cnx.commit();

#close connection
cursor.close()
cnx.close()