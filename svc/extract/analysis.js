const unfluff = require("unfluff");
const moment = require("moment-timezone");

const { analyseContent } = require("./analyseContent");
const { analyseLinks } = require("./analyseLinks");
const { analyseAuthors } = require("./analyseAuthors");
const { analyseUrl } = require("./analyseUrl");
const { getSpecificUrl, getDomain } = require("./helpers");
const postData = require("../../config/postData");

module.exports = { analysis };

async function analysis(content_url, data, frame_compatible) {
  // console.log('starting analysis')
  let {
    title,
    softTitle,
    date,
    image,
    lang,
    publisher,
    keywords,
    description,
    canonicalLink,
    text,
    links,
    videos,
    author,
  } = unfluff(data);

  if (softTitle) title = softTitle;
  if (canonicalLink) content_url = canonicalLink;

  // if (!date) date = "";
  let publication_date = moment().tz("America/Chicago").toISOString();

  if (date) {
    const dateConfig = {
      target: "helper-date",
      data: { date, url: content_url },
      trigger: "scanner",
      mins: 1,
    };
    const date_response = await postData(dateConfig);
    if (data_response) {
      publication_date = date_response;
    } else {
      console.log(
        `no proper date response for ${content_url}, reverting to default`
      );
    }
  } else {
    console.log(
      `no date from unfluff for ${content_url}, reverting to default`
    );
  }
  const domain = getDomain(content_url);
  const amp_url = getSpecificUrl(data, "amphtml");

  const content = analyseContent(title, text);
  content.url_info = analyseUrl(content_url);
  content.links = analyseLinks(links, videos, domain);
  content.authors = analyseAuthors(author, data, domain, content_url);
  content.extract = {
    frame_compatible,
    keywords,
    description,
    excerpt: content.excerpt,
  };

  const { content_type } = content.url_info;
  const { content_minutes, identifier_words } = content;

  content.core = {
    title,
    content_url,
    amp_url,
    content_type,
    publication_date,
    image,
    language: lang,
    publisher,
    content_minutes,
    identifier_words,
  };

  return content;
}
