# Generated by Django 4.2 on 2023-10-01 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_event_remove_user_address_user_lat_user_long_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='approved',
            field=models.BooleanField(default=False),
        ),
    ]
