import json
article_array = json.loads(open('articles.json').read())
store_list = []

for category in article_array:
    for article in category:
        message = "category: " + article['category'] +" title: " +article['title']
        print(message.encode('ascii', 'ignore'))


# import sys
#
# if __name__ == "__main__":
#     st = sys.argv[1]
#     print(st + "from python")
