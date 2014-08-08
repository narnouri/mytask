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
cursor.execute("INSERT INTO Users (username, password) VALUES ('user1', 'pwd1'), ('user2', 'pwd2')")
cnx.commit()

#close connection
cursor.close()
cnx.close()
