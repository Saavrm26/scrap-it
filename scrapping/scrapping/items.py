from dataclasses import dataclass


@dataclass
class Job:
    company_name: str = 'NA'
    company_about_url: str = 'NA'
    location: str = 'NA'

    job_type: str = 'NA'
    job_title: str = 'NA'
    job_url: str = 'NA'

    salary: tuple[str] = 'NA',
    shift_and_schedule: tuple[str] = 'NA',
    benefits_and_perks: tuple[str] = 'NA',
