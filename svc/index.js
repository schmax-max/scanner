"use strict";
const moment = require("moment-timezone");

const { extract } = require("./extract");
const { Scan } = require("../model");
const { analyseContent } = require("./extract/analyseContent");
const { analyseUrl } = require("./extract/analyseUrl");
const postData = require("../config/postData");
const { gateway } = require("./gateway");

module.exports = { master, commander, masterPerUrl };

async function master(req) {
  if (gateway(req)) {
    commander(req.body);
    return;
  } else {
    return "invalid";
  }
}

async function commander({
  source_url,
  source_type,
  links = [],
  extras = [],
  coreInfos = []
}) {
  let iterations = links.length;
  // console.log({ source_type });
  // iterations = 1
  let responses = [];
  for (let i = 0; i < iterations; i++) {
    try {
      const refs = Object.assign(
        extras[i] || {},
        { index: i },
        { source_url },
        { source_type }
      );
      const response = await masterPerUrl(links[i], refs, coreInfos[i]);
      responses.push(response);
    } catch (e) {
      console.log({ e });
    }
  }
  return responses;
}

async function masterPerUrl(content_url, refs, coreInfo) {
  // console.log({content_url})
  try {
    // let item;

    let item;

    if (!coreInfo) {
      item = await queryExistingScans(content_url);
      if (!item) {
        item = await extract(content_url);
      }
    } else {
      if (coreInfo.snippet) {
        item = analyseContent(coreInfo.title, coreInfo.snippet);
        item.url_info = analyseUrl(coreInfo.content_url);
      } else {
        item = await extract(content_url);
      }
    }

    if (coreInfo) {
      item.core = Object.assign(item.core || {}, coreInfo);
    }

    if (item.error) {
      console.log({ error: item.error });
      return;
    } else {
      const scores = await postToCalculator(item, refs);
      const update = await updateScan(item);
      postToLibrarian(item, scores);
      return update;
    }
  } catch (e) {
    console.log({ e });
    return;
  }
}

async function queryExistingScans(content_url) {
  const { content_type } = analyseUrl(content_url);
  const item = await Scan[`${content_type}s`].findOne({ content_url });
  return item;
}

async function postToCalculator({ core, links }, refs) {
  const calculatorConfig = {
    target: "calculator",
    data: { core, links, refs },
    mins: 1
  };
  return await postData(calculatorConfig);
}

function postToLibrarian(
  { core, url_info, word_arrays, frequent_words, search_words },
  scores
) {
  const librarianConfig = {
    target: "librarian",
    data: { core, url_info, word_arrays, frequent_words, search_words, scores },
    mins: 5
  };
  postData(librarianConfig);
  return;
}

async function updateScan(item) {
  const { content_url, content_type } = item.core;
  const updated_at = moment()
    .tz("America/Chicago")
    .toISOString();
  const options = { upsert: true, new: true };
  item = Object.assign(item, { updated_at });
  return await Scan[`${content_type}s`].findOneAndUpdate(
    { content_url },
    item,
    options
  );
}
