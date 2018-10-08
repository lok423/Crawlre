import json
import tfidf
import time
import RAKE
import textrank



start_time = time.time()
article_array = json.loads(open('articles.json').read())
news_list = []
features_list = []
opinion_list = []
teaching_list = []
sectors_list = []
future_list = []
RAKE_STOPLIST = 'stoplists/SmartStoplist.txt'


for index, category in enumerate(article_array):
    if index==0:
        for article in category:
            news_list.append({"title": article['title'].encode('ascii', 'ignore')})
    elif index==1:
        for article in category:
            features_list.append(article['title'])
    elif index==2:
        for article in category:
            opinion_list.append(article['title'])
    elif index==3:
        for article in category:
            teaching_list.append(article['title'])
    elif index==4:
        for article in category:
            sectors_list.append(article['title'])
    elif index==5:
        for article in category:
            future_list.append(article['title'])

print(news_list[:100])

print("=== 3. RAKE")
rake = RAKE.Rake(RAKE_STOPLIST, min_char_length=2, max_words_length=5)
for page in news_list:
    page["rake_results"] = rake.run(page["title"])
print("RAKE: %d" % (time.time() - start_time))



document_frequencies = {}
document_count = len(news_list)
for page in news_list:
    page["tfidf_frequencies"] = tfidf.get_word_frequencies(page["title"])
    for word in page["tfidf_frequencies"]:
        document_frequencies.setdefault(word, 0)
        document_frequencies[word] += 1
sortby = lambda x: x[1]["score"]
for page in news_list:
    for word in page["tfidf_frequencies"].items():
        #print(word)
        word_frequency = word[1]["frequency"]
        docs_with_word = document_frequencies[word[0]]
        #print(word_frequency)
        #print(docs_with_word)
        word[1]["score"] = tfidf.calculate(word_frequency, document_count, docs_with_word)

    page["tfidf_results"] = sorted(page["tfidf_frequencies"].items(), key=sortby, reverse=True)
print("TF-IDF: %d" % (time.time() - start_time))


for page in news_list:
    textrank_results = textrank.extractKeyphrases(page["title"])
    page["textrank_results"] = sorted(textrank_results.items(), key=lambda x: x[1], reverse=True)
print("TextRank: %d" % (time.time() - start_time))


print("=== 6. Results")
for page in news_list:
    print("-------------------------")
    # print("URL: %s" % page["url"])
    # print("RAKE:")
    # for result in page["rake_results"][:5]:
    #     print(" * %s" % result[0])
    # print("TF-IDF:")
    # for result in page["tfidf_results"][:5]:
    #     print(" * %s" % result[0])
    print("TextRank:")
    for result in page["textrank_results"][:5]:
        print(" * %s" % result[0])

end_time = time.time() - start_time
print('Done. Elapsed: %d' % end_time)
    # for article in category:
        # message = "category: " + article['category'] +" title: " +article['title']
        # print(message.encode('ascii', 'ignore')[:100])


# import sys
#
# if __name__ == "__main__":
#     st = sys.argv[1]
#     print(st + "from python")
