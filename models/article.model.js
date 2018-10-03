class Article {



  constructor(id,category,title, subtitle, author, date, content) {
    this.id = id;
    this.category = category;
    this.title = title;
    this.subtitle = subtitle;
    this.author = author;
    this.date = date;
    this.content = content;
  }
}

module.exports = {Article};
