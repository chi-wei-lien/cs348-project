# Generated by Django 5.1.2 on 2024-11-28 19:53

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddIndex(
            model_name='question',
            index=models.Index(fields=['posted_by'], name='questions_q_posted__613542_idx'),
        ),
    ]