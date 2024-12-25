# Generated by Django 5.1.2 on 2024-12-25 05:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0003_group_created_by'),
        ('questions', '0004_question_group'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='group',
            field=models.ForeignKey(default=4, on_delete=django.db.models.deletion.CASCADE, to='groups.group'),
            preserve_default=False,
        ),
    ]
