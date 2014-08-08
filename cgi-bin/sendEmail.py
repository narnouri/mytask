#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cgi
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

print "Content-type: text/html"
print

form = cgi.FieldStorage()

#define the address to send to, and email body
fromaddr = 'mytask.send@gmail.com'
toaddr = form.getvalue('emailto')

msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = 'Thanks for Using MyTask'
body = form.getvalue('emailbody')
msg.attach(MIMEText(body, 'plain'))

#gmail smtp connection
server = smtplib.SMTP('smtp.gmail.com', 587)
server.ehlo()
server.starttls()
server.ehlo()
#gmail authintication
server.login('mytask.send', 'mytask123456')
text = msg.as_string()
server.sendmail(fromaddr, toaddr, text)