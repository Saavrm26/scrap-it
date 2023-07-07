from dataclasses import dataclass


@dataclass
class Job:
    company: str
    company_about_url: str
    job_type: str = 'NA'
    education: list[str] = ['NA']
    skills: list[str] = ['NA']
    url: str = ['NA']
    location: str = 'NA'
    salary: list[str] = ['NA']
