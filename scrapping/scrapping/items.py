from dataclasses import dataclass


@dataclass
class Job:
    company_name: str = ''
    company_about_url: str = ''
    location: str = ''

    job_type: str = ''
    job_title: str = ''
    job_url: str = ''

    salary: tuple[str] = '',
    shift_and_schedule: tuple[str] = '',
    benefits_and_perks: tuple[str] = '',
