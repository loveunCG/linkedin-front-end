# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-27 22:01
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20180428_0623'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='visitcount',
        ),
    ]
