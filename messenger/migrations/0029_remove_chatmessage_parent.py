# Generated by Django 2.0.5 on 2018-06-16 02:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0028_inbox_first_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatmessage',
            name='parent',
        ),
    ]