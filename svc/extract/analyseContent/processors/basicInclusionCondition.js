'use strict'
const _ = require ('lodash')
const {wordArrays} = require ('../input/inputWords')

function basicInclusionCondition (word) {
  if (word) {
    
    const {common_words, personal_titles} = wordArrays

    const c1 = word.length > 1
    const c2 = common_words.indexOf(word.toLowerCase()) === -1
    const c3 = personal_titles.indexOf(word.toLowerCase()) === -1
    return c1 && c2 && c3
  } else {
    return false
  }

}


module.exports = {
    basicInclusionCondition,
}
