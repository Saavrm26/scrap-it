from dataclasses import dataclass


@dataclass
class Job:
    company_name: str
    company_about_url: str
    location: str = 'NA'

    job_type: str = 'NA'
    job_title: str = 'NA'
    job_url: str = 'NA'

    salary: list[str] = ['NA']
    shift_and_schedule: list[str] = ['NA']
    benefits_and_perks: list[str] = ['NA']
