"use strict";
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _type: {
    type: "string",
    default: "Article",
  },
  _id: {
    type: "ObjectId",
  },
  updated_at: {
    type: "date",
    format: "date-time",
  },
  content_url: {
    type: "string",
  },
  extract: {
    type: "object",
  },
  links: {
    type: "object",
  },
  analysis: {
    type: "object",
  },
  word_arrays: {
    type: "object",
  },
  frequent_words: {
    type: "array",
  },
  search_words: {
    type: "array",
  },
  core: {
    type: "object",
  },
  authors: {
    type: "object",
  },
  url_info: {
    type: "object",
  },
});

schema.set("toJSON", { virtuals: true });

function createModels() {
  const collections = [
    "articles",
    "photos",
    "podcasts",
    "videos",
    "newsletters",
  ];
  const models = {};
  collections.forEach((collection) => {
    models[collection] = mongoose.model(
      `scan_${collection}`,
      schema,
      `scan_${collection}`
    );
  });
  return models;
}

module.exports = createModels();
