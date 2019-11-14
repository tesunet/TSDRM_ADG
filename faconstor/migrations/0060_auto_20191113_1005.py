# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-11-13 10:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('faconstor', '0059_process_hosts_manage'),
    ]

    operations = [
        migrations.AddField(
            model_name='process',
            name='main_database',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='主数据库'),
        ),
        migrations.AddField(
            model_name='process',
            name='prepare_database',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='备数据库'),
        ),
    ]