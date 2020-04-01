const {basicInclusionCondition} = require ('./basicInclusionCondition')

function processTitle (articleTitle, frequency_analysis, multi_capital) {
    // check if title words are part of common / capital words

    articleTitle = articleTitle.toLowerCase()
    const noCharacterTitle = articleTitle.replace(/[^A-Za-z\-\s\d\’]/g, "")
    // console.log({noCharacterTitle})
    const titleWords = noCharacterTitle.split(/[\W]/)

    const multi_title = {}
    multi_title.all = []
    multi_title.frequent = []
    multi_capital.all.forEach((item) => {
        if (noCharacterTitle.includes(item)) {
            includeInArray (item, multi_title.all)
            if (multi_capital.frequent.indexOf(item) > -1) {
                includeInArray (item, multi_title.frequent)
            }
        }
    })
    const multiTitleString = multi_title.all.join(' ')

    const all_title = {}
    all_title.all = []
    all_title.frequent = []
    
    const single_title = {}
    single_title.all = []
    single_title.frequent = []
    
    titleWords.forEach((item) => {
        if (basicInclusionCondition(item)) {
            const isMulti = multiTitleString.includes(item)
            includeInArray (item, all_title.all)
            if (!isMulti) {
                includeInArray (item, single_title.all)
            }
            if (frequency_analysis.array.indexOf(item) > -1) {
                includeInArray (item, all_title.frequent)
                if (!isMulti) {
                    includeInArray (item, single_title.frequent)
                }
            }
        }
    })

    return {single_title, multi_title}
}

function includeInArray (item, array) {
    if (array.indexOf(item) === -1) {
        array.push(item)
    }
    return array
}

module.exports = {
    processTitle,
}
