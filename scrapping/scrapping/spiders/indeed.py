import scrapy

from scrapping.job_loader import JobLoader

from scrapping.color_printing import prRed, prYellow

RESPONSE = scrapy.http.Response


meta = {
    "playwright": True
}


class IndeedSpider(scrapy.Spider):
    # TODO: Use Scrapper API to implement proxy
    # TODO: Create an pipeline for compression
    name = "indeed"

    def __init__(self, title: str, location: str, *args, **kwargs):
        super(IndeedSpider, self).__init__(*args, **kwargs)
        self.title = title
        self.location = location
        self.url = f"https://in.indeed.com/jobs?q={title.replace(' ', '+')}&l={location}"

    def start_requests(self):
        try:
            prYellow("Inside start_requests")
            yield scrapy.Request(self.url, callback=self.parse_job_cards, meta=meta)
        except Exception as e:
            prRed(e)
            prRed("At start_requests")

    def parse_job_cards(self, response):
        try:
            prYellow("Inside parse_job_cards")
            job_cards_list = response.css(
                ".jobsearch-ResultsList").css(".cardOutline")

            for job_card in job_cards_list[0:2]:

                jk = job_card.css('a::attr(data-jk)').get()
                job_url = f"https://in.indeed.com/viewjob?jk={jk}"

                yield response.follow(job_url, callback=self.parse_job_page, meta=meta)

        except Exception as e:
            prRed(e)
            prYellow("At parse_job_cards")

    def parse_job_page(self, response):
        try:
            prYellow("Inside parse_job_page")
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

            yield JobLoader(scrappedItems).load_item()()


        except Exception as e:
            prRed(e)
            prYellow("At parse_job_page")
            yield None
