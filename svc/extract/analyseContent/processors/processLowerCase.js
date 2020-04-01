const _ = require('lodash')
const {wordArrays} = require ('../input/inputWords')
const {inputValues} = require ('../input/inputValues')

function processLowerCase (articleWordsLowerCase, wordCount) {
    // Cycle through lower case ONLY words
    
    const {common_words, personal_words, group_words} = wordArrays


    let allCommon = []
    let personal = []
    let group = []

    let personalWordCounter = 0
    let groupWordCounter = 0
    articleWordsLowerCase.reduce((newArray, articleWord) => {
        if (articleWord.length > 1 && common_words.indexOf(articleWord) === -1) {
            allCommon.push(articleWord)
        }

        if (personal_words.indexOf(articleWord) > -1) {
            personal.push(articleWord)
            personalWordCounter += 1
        }

        if (group_words.indexOf(articleWord) > -1) {
            group.push(articleWord)
            groupWordCounter += 1
        }

        return newArray
    }, [])


    const frequency_analysis = organiseWordsByCount(allCommon, wordCount)



    const frequentWordCounter = frequency_analysis.counter

    const density = {
        frequent: +(frequentWordCounter / wordCount).toFixed(5),
        personal: +(personalWordCounter / wordCount).toFixed(5),
        group: +(groupWordCounter / wordCount).toFixed(5),
    }

    return {frequency_analysis, density}

}

function organiseWordsByCount (inputWords, wordCount) {
    const {threshold_percentage, threshold_count} = inputValues
    const thresholdCount = Math.max(threshold_count, threshold_percentage * wordCount)

    const relevantWordsCount = inputWords.reduce((newCollection, inputWord) => {
        newCollection[inputWord] = (newCollection[inputWord] || 0) + 1;
        return newCollection
    }, {})

    let relevantWordsCollection  = [];
    for (var property in relevantWordsCount) {
        if (relevantWordsCount.hasOwnProperty(property)) {
            relevantWordsCollection.push({
                word: property,
                count: relevantWordsCount[property],
                relevancy: +(relevantWordsCount[property]/wordCount).toFixed(5)
            });
        }
    }

    relevantWordsCollection = relevantWordsCollection.sort((a, b) => { return b.count - a.count });

    let counter = 0
    relevantWordsCollection = relevantWordsCollection.reduce((newCollection, object) => {
        if (object.count > thresholdCount) {
            newCollection.push(object)
            counter += object.count
        }
        return newCollection
    }, [])

    const collection = relevantWordsCollection
    const array = _.map(relevantWordsCollection, 'word')

    return {collection, array, counter}
}

module.exports = {
    processLowerCase,
}
