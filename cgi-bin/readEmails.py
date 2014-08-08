#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import cgi
import json
import MySQLdb
import sys

print "Content-type: application/json"
print

form = cgi.FieldStorage()

#database connection
cnx = MySQLdb.connect(user='root',passwd='7864',host='127.0.0.1',db='MyApp')
cursor = cnx.cursor()
cursor.execute('SELECT email FROM Emails')
response = cursor.fetchall()

print(json.JSONEncoder().encode(response))

#close connection
cursor.close()
cnx.close()