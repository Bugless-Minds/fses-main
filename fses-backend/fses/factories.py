import factory
from faker import Faker
from django.contrib.auth.hashers import make_password
from fses.models import CustomUser, Department, Lecturer, Student, Nomination
import random

fake = Faker('en_MS')

class CustomUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    username = factory.LazyAttribute(lambda _: fake.user_name())
    email = factory.LazyAttribute(lambda _: fake.email())
    password = factory.LazyFunction(lambda: make_password("password123"))
    role = factory.Iterator([
        CustomUser.OFFICE_ASSISTANT,
        CustomUser.SUPERVISOR,
        CustomUser.PROGRAM_COORDINATOR,
        CustomUser.PGAM
    ])
    is_first_time = False


class DepartmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Department

    name = factory.LazyAttribute(lambda _: fake.company())
    code = factory.LazyAttribute(lambda _: fake.lexify(text="???"))


class LecturerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Lecturer

    name = factory.LazyAttribute(lambda _: fake.name())
    department = factory.LazyFunction(lambda: random.choice(Department.objects.all()))
    title = factory.Iterator([1, 2, 3])  # Professor, Associate, Doctor
    university = "UTM"
    staff = None  # You can link to CustomUserFactory if needed


class StudentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Student

    name = factory.LazyAttribute(lambda _: fake.name())
    supervisor = factory.SubFactory(LecturerFactory)
    co_supervisor = factory.SubFactory(LecturerFactory)
    program = factory.Iterator(["PHD", "MPHIL", "DSE"])
    semester = factory.LazyAttribute(lambda _: fake.random_int(min=1, max=6))
    evaluation_type = factory.Iterator(["FIRST_EVALUATION", "RE_EVALUATION"])
    department = factory.LazyFunction(lambda: random.choice(Department.objects.all()))


class NominationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Nomination

    student = factory.SubFactory(StudentFactory)
    examiner1 = factory.SubFactory(LecturerFactory)
    examiner2 = factory.SubFactory(LecturerFactory)
    examiner3 = factory.SubFactory(LecturerFactory)
    research_title = factory.LazyAttribute(lambda _: fake.sentence(nb_words=6))
    is_locked = False
    chairperson = factory.SubFactory(LecturerFactory)
