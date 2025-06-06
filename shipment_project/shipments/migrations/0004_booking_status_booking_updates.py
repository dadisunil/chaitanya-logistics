# Generated by Django 4.2.7 on 2025-04-27 12:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shipments', '0003_booking_description_booking_dimensions_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='status',
            field=models.CharField(default='in-transit', max_length=50),
        ),
        migrations.AddField(
            model_name='booking',
            name='updates',
            field=models.JSONField(default=list),
        ),
    ]
