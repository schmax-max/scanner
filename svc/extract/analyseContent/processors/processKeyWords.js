const _ = require('lodash')

function processKeyWords (multi_analysis, upper_analysis, frequency_analysis, title_analysis) {
    const key_long = _.flattenDeep(_.concat(
        frequency_analysis.single_lower_frequent.array,
        upper_analysis.single_capital,
        upper_analysis.single_acronym,
        multi_analysis.multi_capital,
        title_analysis.single_title,
    ))

    const key_trending = _.flattenDeep(_.concat(
        // frequency_analysis.single_lower_frequent.array,
        // frequency_analysis.single_acronym_frequent.array,
        // frequency_analysis.single_capital_frequent.array,
        // multi_analysis.multi_capital,
        // multi_analysis.multi_capital_frequent,
        title_analysis.multi_title,
        title_analysis.multi_title_frequent,
        title_analysis.single_title,
        title_analysis.single_title_frequent,
    ))

    const key_short = _.flattenDeep(_.concat(
        frequency_analysis.single_lower_frequent.array,
        frequency_analysis.single_acronym_frequent.array,
        frequency_analysis.single_capital_frequent.array,
        frequency_analysis.multi_capital_frequent,
        // title_analysis.single_title_frequent,
    ))

    // console.log({keyArrayShort})
    // console.log({articleUrl})

    const allKeyWords = _.concat(
        key_long,
        key_short
    )

    
    const key_weighted = getKeyWordFrequency (allKeyWords, [])

    const key_words = {
      key_short,
      key_trending,
      key_long,
      key_weighted,
    }
    return {key_words}
}

function getKeyWordFrequency (keyWords, excludedWords) {

    keyWords = keyWords.reduce((revisedArray, word) => {
        if (excludedWords.indexOf(word) === -1) {
            revisedArray.push(word)
        }
        return revisedArray
    }, [])

    // Count frequency in the array
    keyWords = keyWords.reduce((revisedCollection, word) => {
        revisedCollection[word] = (revisedCollection[word] || 0) + 1;
        return revisedCollection
    }, {})

    // Create a collection with labels for key and value
    let keyWordsThisGroup  = [];
    for (var prop in keyWords) {
        if (keyWords.hasOwnProperty(prop)) {
            keyWordsThisGroup.push({
                word: prop,
                count: keyWords[prop]
            });
        }
    }

    keyWordsThisGroup = keyWordsThisGroup.sort((a, b) => { return b.count - a.count })

    return keyWordsThisGroup

}


module.exports = {
    processKeyWords
}
