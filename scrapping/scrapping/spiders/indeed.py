import scrapy
import os


class IndeedSpider(scrapy.Spider):
    name = "indeed"

    def __init__(self, title: str, location: str, *args, **kwargs):
        super(IndeedSpider, self).__init__(*args, **kwargs)
        self.title = title
        self.location = location
        self.url = f"https://in.indeed.com/jobs?q={title.replace(' ', '+')}&l={location}"

    def start_requests(self):
        yield scrapy.Request(self.url, callback=self.parse, meta={"playwright": True})

    def parse(self, response: scrapy.selector):
        job_cards_list = response.css(".jobsearch-ResultsList")
        