# Generated by Django 2.0.5 on 2018-06-06 13:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0034_auto_20180606_0809'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='linkedinuser',
            name='message_limit',
        ),
        migrations.AddField(
            model_name='linkedinuser',
            name='message_limit_default',
            field=models.IntegerField(default=75),
        ),
    ]
