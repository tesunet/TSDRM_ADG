# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-09-23 11:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('faconstor', '0037_remove_processrun_scn'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ClientManage',
        ),
    ]
