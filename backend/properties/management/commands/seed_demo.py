"""Create sample properties, gallery images and FAQs for local development.

    python manage.py seed_demo            # downloads photos from picsum.photos
    python manage.py seed_demo --offline  # generates plain gradient images instead
"""
import io
import urllib.request
from decimal import Decimal

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw

from gallery.models import GalleryImage
from properties.models import Amenity, Property
from django.contrib.auth.models import User

from reviews.models import FAQ, Review

PROPERTIES = [
    dict(name='Azure Cliff Villa', property_type='Villa', address='Varkala, Kerala', price='18500', advance='5000',
         guests=8, rooms=4, bedrooms=4, bathrooms=4,
         description='A cliff-top villa above the Arabian Sea with a private infinity pool, sunset deck and '
                     'four airy bedrooms. Daily housekeeping and a resident chef make it effortless for families '
                     'and groups.'),
    dict(name='Misty Hills Estate', property_type='Plantation Bungalow', address='Munnar, Kerala', price='12000',
         advance='4000', guests=6, rooms=3, bedrooms=3, bathrooms=3,
         description='A restored colonial bungalow inside a working tea estate. Wake up to rolling green hills, '
                     'walk the plantation trails and end the day by the fireplace.'),
    dict(name='Backwater Retreat', property_type='Lake House', address='Alleppey, Kerala', price='9500',
         advance='3000', guests=4, rooms=2, bedrooms=2, bathrooms=2,
         description='A calm lake house on the Vembanad backwaters with a private jetty, kayaks and a shaded '
                     'verandah made for long lunches.'),
    dict(name='Palm Grove Pool House', property_type='Villa', address='Goa', price='15000', advance='5000',
         guests=10, rooms=5, bedrooms=5, bathrooms=5,
         description='Five bedrooms around a palm-fringed pool, ten minutes from the beach. Built for celebrations, '
                     'with a lawn, outdoor bar and alfresco dining area.'),
    dict(name='Forest Edge Cabin', property_type='Cabin', address='Wayanad, Kerala', price='7000', advance='2500',
         guests=3, rooms=1, bedrooms=1, bathrooms=1,
         description='A timber cabin on the edge of the forest with a hammock deck, bonfire pit and the sound of '
                     'the stream all night.'),
]
AMENITIES = ['Swimming Pool', 'WiFi', 'Lawn', 'Bar', 'Alfresco Dining', 'Complimentary breakfast',
             'Air conditioning', 'Pet Friendly', 'Infinity Pool', 'Parking', 'Housekeeping']
SPACES = [('Living Room', 'Living'), ('Master Bedroom', 'Bedroom'), ('Pool Deck', 'Outdoors'), ('Dining', 'Dining')]
REVIEWS = [
    ('meera_k', 5, 'Woke up to the sea every morning. The pool deck at sunset is unreal and the staff made our '
                    'anniversary feel special.'),
    ('rahul.v', 5, 'Spotless rooms, a chef who cooked whatever we asked for, and the kids never wanted to leave '
                   'the pool. Booking was effortless.'),
    ('ananya_s', 4, 'Beautiful, quiet and exactly like the photos. The drive up is long, but the view is worth '
                    'every minute.'),
    ('arjun.p', 5, 'We were a group of ten and there was room for everyone. The team was a call away whenever we '
                   'needed anything.'),
    ('fatima_z', 4, 'Lovely cabin, great hammock deck and the bonfire was the highlight. Would come back in the '
                    'monsoon.'),
]
FAQS = [
    ('What time is check-in and check-out?', 'Check-in is from 2 PM and check-out is by 11 AM. Early check-in is '
                                             'subject to availability.'),
    ('How much advance do I pay?', 'You pay the advance shown at checkout to confirm the booking. The balance is '
                                   'paid at the property.'),
    ('Can I cancel my booking?', 'Yes. Cancel from My Bookings at least 7 days before check-in for a refund, '
                                 'processed within 10 business days.'),
    ('Are pets allowed?', 'Pet-friendly properties are marked with the Pet Friendly amenity.'),
]


class Command(BaseCommand):
    help = 'Seed demo properties, gallery images and FAQs.'

    def add_arguments(self, parser):
        parser.add_argument('--offline', action='store_true', help='Generate images instead of downloading them.')

    def image(self, seed, offline, size=(1600, 1000)):
        if not offline:
            try:
                url = f'https://picsum.photos/seed/{seed}/{size[0]}/{size[1]}'
                with urllib.request.urlopen(url, timeout=20) as resp:
                    return resp.read()
            except Exception as exc:
                self.stderr.write(f'Download failed ({exc}); generating an image instead.')
        img = Image.new('RGB', size)
        draw = ImageDraw.Draw(img)
        h = abs(hash(seed))
        a, b = (h % 120 + 40, h // 7 % 120 + 60, h // 13 % 120 + 80), (20, 24, 30)
        for y in range(size[1]):
            t = y / size[1]
            draw.line([(0, y), (size[0], y)], fill=tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3)))
        buf = io.BytesIO()
        img.save(buf, 'JPEG', quality=85)
        return buf.getvalue()

    def handle(self, *args, offline=False, **options):
        amenities = [Amenity.objects.get_or_create(name=n)[0] for n in AMENITIES]
        for i, data in enumerate(PROPERTIES):
            if Property.objects.filter(name=data['name']).exists():
                continue
            slug = data['name'].lower().replace(' ', '-')
            prop = Property(
                name=data['name'], property_type=data['property_type'], address=data['address'],
                description=data['description'], price=Decimal(data['price']),
                advance_amount=Decimal(data['advance']), guests=data['guests'], rooms=data['rooms'],
                bedrooms=data['bedrooms'], bathrooms=data['bathrooms'],
            )
            prop.image.save(f'{slug}.jpg', ContentFile(self.image(slug, offline)), save=True)
            prop.amenities.set(amenities[i % 3: i % 3 + 6 + i % 3])
            for title, tag in SPACES:
                g = GalleryImage(property=prop, title=title, tag=tag,
                                 description=f'{title} at {prop.name}.')
                g.image.save(f'{slug}-{tag.lower()}.jpg',
                             ContentFile(self.image(f'{slug}-{tag}', offline, (1200, 800))), save=True)
            self.stdout.write(f'Created {prop.name}')
        props = list(Property.objects.order_by('id'))
        for i, (username, rating, comment) in enumerate(REVIEWS):
            if not props:
                break
            user, created = User.objects.get_or_create(username=username, defaults={'email': f'{username}@example.com'})
            if created:
                user.set_unusable_password()
                user.save()
            Review.objects.get_or_create(user=user, property=props[i % len(props)],
                                         defaults={'rating': rating, 'comment': comment})
        for q, a in FAQS:
            FAQ.objects.get_or_create(question=q, defaults={'answer': a})
        self.stdout.write(self.style.SUCCESS('Demo data ready.'))
