"use strict";
const _ = require("lodash");

const { cleanLink } = require("./cleanLink");
const { categoriseLinks } = require("./categoriseLinks");
const { bugsnagReport } = require("../../../config/bugsnagReport");

module.exports = {
  analyseLinks,
};

function analyseLinks(links, videos, domain) {
  const initialArray = _.concat(links, videos);
  // console.log({links, videos, initialArray})
  const linkArray = initialArray.reduce((arr, k) => {
    let link = k.href || k.src;
    if (link) {
      link = cleanLink(link, domain);
      if (link) {
        arr.push(link);
      }
    } else {
      bugsnagReport("undefined link in analyseLinks", undefined, { k });
    }

    return arr;
  }, []);

  return categoriseLinks(linkArray, domain);
}
