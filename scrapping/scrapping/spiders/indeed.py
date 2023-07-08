import scrapy

import html2text

HTML_RESPONSE = scrapy.http.response.html.HtmlResponse


def prGreen(skk): print("\033[92m {}\033[00m" .format(skk))


def prRed(skk): print("\033[91m {}\033[00m" .format(skk))


meta = {
    "playwright": True
}


class IndeedSpider(scrapy.Spider):
    name = "indeed"

    def __init__(self, title: str, location: str, *args, **kwargs):
        super(IndeedSpider, self).__init__(*args, **kwargs)
        self.title = title
        self.location = location
        self.url = f"https://in.indeed.com/jobs?q={title.replace(' ', '+')}&l={location}"

    def start_requests(self):
        yield scrapy.Request(self.url, callback=self.parse_job_cards, meta=meta)

    def parse_job_cards(self, response: HTML_RESPONSE):
        try:
            job_cards_list = response.css(
                ".jobsearch-ResultsList").css(".cardOutline")
            for job_card in job_cards_list[0:1]:
                jk = job_card.css('a::attr(data-jk)').get()
                job_url = f"https://in.indeed.com/viewjob?jk={jk}"
                yield response.follow(job_url, callback=self.parse_job_page, meta=meta)
        except Exception as e:
            prRed(e)

    def parse_job_page(self, response: HTML_RESPONSE):
        try:

            job_title = response.css(
                'h1.jobsearch-JobInfoHeader-title span::text').get()
            job_url = response.url
            location = response.css(
                'div[data-testid="inlineHeader-companyLocation"] div::text').get()
            company_name = response.css(
                'div[data-testid="inlineHeader-companyName"] a::text').get()
            company_about_url = response.css(
                'div[data-testid="inlineHeader-companyName"] a::attr(href)').get()
            company_about_url = company_about_url.split('?')[0]

            job_details_dict = self.extract_job_details(
                response.css('#jobDetailsSection').get())
            salary = job_details_dict["salary"]
            job_type = job_details_dict["job type"]
            shift_and_schedule = job_details_dict["shift and schedule"]
            benefits_and_perks = job_details_dict["benefits and perks"]

            prGreen(job_details_dict)

            # TODO: Create an pipeline for serialization and compression
            # TODO: Use Scrapper API to implement proxy

        except Exception as e:
            prRed(e)

    def extract_job_details(self, job_details_section: str):
        html_converter = html2text.HTML2Text()
        html_converter.ignore_links = True

        job_details_text = html_converter.handle(job_details_section)

        lines = job_details_text.split('\n')
        keys = ["salary", "job type",
                "shift and schedule", "benefits and perks"]
        job_details = {}
        for key in keys:
            job_details[key] = ['NA']
        current_key = None

        for line in lines:
            if not line:
                continue
            line = line.lower()
            for key in keys:
                if key in line:
                    current_key = key
                    job_details[current_key] = []
                    break

            if current_key:
                if line.strip().lower() != current_key:
                    job_details[current_key].append(line.strip())
                else:
                    job_details[current_key] = []

        return job_details
