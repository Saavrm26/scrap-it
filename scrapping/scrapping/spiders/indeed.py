import scrapy
import os
from scraper_api import ScraperAPIClient

client = ScraperAPIClient(os.environ.get('SCRAPER_API_KEY'))


class IndeedSpider(scrapy.Spider):
    name = "indeed"

    def api_url(url: string):
        return client.scrapyGet(url, render=true, retry=1)

    def __init__(self, title: str, location: str, *args, **kwargs):
        super(IndeedSpider, self).__init__(*args, **kwargs)
        self.title = title
        self.location = location
        self.start_urls = [
            f"https://in.indeed.com/jobs?q={'+'.join(title.split(' '))}&l={location}"]

    def parse(self, response: scrapy.selector):
        response.css()
