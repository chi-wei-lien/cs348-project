# Generated by Django 5.1.2 on 2024-12-25 06:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0005_alter_question_group'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='group',
            new_name='group_id',
        ),
    ]