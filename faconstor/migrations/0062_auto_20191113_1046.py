# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-11-13 10:46
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('faconstor', '0061_auto_20191113_1016'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='process',
            name='main_database',
        ),
        migrations.RemoveField(
            model_name='process',
            name='prepare_database',
        ),
    ]
