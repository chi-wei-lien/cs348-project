# Generated by Django 5.1.2 on 2024-12-25 03:15

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('languages', '0001_initial'),
        ('questions', '0003_question_questions_q_posted__613542_idx'),
        ('solutions', '0004_solution_sc_solution_tc'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddIndex(
            model_name='solution',
            index=models.Index(fields=['q_id'], name='solutions_s_q_id_id_b9f125_idx'),
        ),
    ]
