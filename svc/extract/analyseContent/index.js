"use strict";
const _ = require("lodash");
const unidecode = require("unidecode");
const { processPureContent } = require("./processors/processPureContent");
const { processUpperCase } = require("./processors/processUpperCase");
// const {processKeyWords} = require ('./processors/processKeyWords')
const { processLowerCase } = require("./processors/processLowerCase");
const { processFrequency } = require("./processors/processFrequency");
const { processTitle } = require("./processors/processTitle");
const { inputValues } = require("./input/inputValues");

function analyseContent(articleTitle, pureContent) {
  pureContent = ensureNewParagraphs(pureContent);
  pureContent = unidecode(pureContent);

  const {
    identifier_words,
    excerpt,
    counts,
    words_per,
    wordCount,
    articleWordsUpperCase,
    articleWordsLowerCase,
  } = processPureContent(pureContent);

  const { frequency_analysis, density } = processLowerCase(
    articleWordsLowerCase,
    wordCount
  );

  const { multi_capital, single_capital, single_acronym } = processUpperCase(
    articleWordsUpperCase,
    frequency_analysis
  );

  const { single_lower } = processFrequency(
    frequency_analysis,
    single_capital,
    single_acronym
  );
  // console.log({single_capital, single_acronym})
  // upper_analysis

  const { single_title, multi_title } = processTitle(
    articleTitle,
    frequency_analysis,
    multi_capital
  );

  // const {
  //   key_words
  // } = processKeyWords (multi_capital, upper_analysis, frequency_analysis, title_analysis)

  const word_arrays = {
    single_lower,
    single_acronym,
    single_capital,
    single_title,
    multi_capital,
    multi_title,
  };

  const frequent_words = _.concat(
    single_lower.frequent,
    single_acronym.frequent,
    single_capital.frequent,
    multi_capital.frequent
  );

  const multiTitleSplit = multi_title.all.reduce((arr, item) => {
    const newArr = item.split(" ");
    arr = _.concat(arr, newArr);
    return arr;
  }, []);

  const search_words = _.concat(
    frequent_words,
    multiTitleSplit,
    single_title.all,
    multi_title.all
  );

  const content_minutes = Math.ceil(wordCount / inputValues.words_per_minute);
  let analysis = {
    counts,
    words_per,
    density,
    frequency_analysis,
  };

  return {
    identifier_words,
    analysis,
    word_arrays,
    frequent_words,
    search_words,
    excerpt,
    content_minutes,
  };
}

function ensureNewParagraphs(text) {
  return text.replace(/([^A-Z][.])([A-Z])/g, "$1\n\n$2");
}

module.exports = {
  analyseContent,
};
