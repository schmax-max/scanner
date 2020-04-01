'use strict'
const moment = require('moment-timezone')
// const Models = require ('../../models/__index');

const {cleanInitialArray} = require('./cleanInitialArray')
const {analyseAllLinks} = require('./analyseAllLinks')
const {getAuthorsArray} = require('./getAuthorsArray')


function analyseAuthors (initialArray, apiResponse, domainName) {
    initialArray = cleanInitialArray(initialArray)
    const initialCollection = analyseAllLinks (apiResponse, domainName)
    const authors_array = getAuthorsArray (initialCollection, initialArray)
    const authors_text = getAuthorsText (authors_array)
    return {
        authors_array,
        authors_text
    }
}


function getAuthorsText (authors_array) {
    const authorsNameArray = authors_array.map((k) => { return k.author_name })

    const authorCount = authorsNameArray.length
    let authors_text = ''
    for (let i = 0; i < authorCount; i++) {
        if (i === authorCount -1) {
            authors_text = `${authors_text}${authorsNameArray[i]}`
        } else if (i === authorCount - 2) {
            authors_text = `${authors_text}${authorsNameArray[i]} & `
        } else {
            authors_text = `${authors_text}${authorsNameArray[i]}, `
        }
    }
}



module.exports = {
    analyseAuthors
}
