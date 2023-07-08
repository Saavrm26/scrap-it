import scrapy

import html2text

from scrapping.job_loader import JobLoader

RESPONSE = scrapy.http.Response


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

    def parse_job_cards(self, response):
        try:

            job_cards_list = response.css(
                ".jobsearch-ResultsList").css(".cardOutline")

            for job_card in job_cards_list[0:1]:

                jk = job_card.css('a::attr(data-jk)').get()
                job_url = f"https://in.indeed.com/viewjob?jk={jk}"

                yield response.follow(job_url, callback=self.parse_job_page, meta=meta)

        except Exception as e:
            prRed(e)

    def parse_job_page(self, response):
        try:

            scrappedItems = {}

            scrappedItems["job_title"] = response.css(
                'h1.jobsearch-JobInfoHeader-title span::text').get()

            scrappedItems["job_url"] = response.url

            scrappedItems["location"] = response.css(
                'div[data-testid="inlineHeader-companyLocation"] div::text').get()

            scrappedItems["company_name"] = response.css(
                'div[data-testid="inlineHeader-companyName"] a::text').get()

            scrappedItems["company_about_url"] = response.css(
                'div[data-testid="inlineHeader-companyName"] a::attr(href)').get()

            scrappedItems["job_details_html"] = response.css(
                '#jobDetailsSection').get()

            yield JobLoader(scrappedItems).load_item()

            # TODO: Create an pipeline for serialization and compression
            # TODO: Use Scrapper API to implement proxy

        except Exception as e:
            prRed(e)
