from django.core.management.base import BaseCommand
from fses.factories import (
    CustomUserFactory,
    DepartmentFactory,
    LecturerFactory,
    StudentFactory,
    NominationFactory
)

class Command(BaseCommand):
    help = "Seed the database with initial data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data only Student and Lecturer...")

        LecturerFactory.create_batch(10)
        StudentFactory.create_batch(20)

        self.stdout.write(self.style.SUCCESS("Database seeded successfully."))
