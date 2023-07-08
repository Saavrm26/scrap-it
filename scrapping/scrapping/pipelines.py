import json
import time
from itemadapter import ItemAdapter
from scrapping.color_printing import prPurple


class JobPipeline:
    # writing to jsonl is only temporary
    def open_spider(self, spider):
        prPurple("Writing to jsonl")
        self.file = open(f"../results/{time.ctime()}.jsonl", "w")

    def close_spider(self, spider):
        prPurple("Closing")
        self.file.close()

    def process_item(self, item, spider):
        # TODO: Sanitize redundant values
        # TODO: Design a database model to store scrapped information
        prPurple("Processing Item")
        line = json.dumps(ItemAdapter(item).asdict()) + "\n"
        self.file.write(line)
        return item
