# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('faconstor', '0056_processrun_rto'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='processrun',
            name='rto',
        ),
    ]
