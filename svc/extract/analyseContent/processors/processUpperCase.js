const {basicInclusionCondition} = require ('./basicInclusionCondition')

function processUpperCase (articleWordsUpperCase, frequency_analysis) {
    const single_acronym = {}
    const single_capital = {}
    
    single_capital.all = []
    single_capital.frequent = []
    single_acronym.all = []
    single_acronym.frequent = []
    let initialMultiCapital = []
    let number = []

    for (let i = 0; i < articleWordsUpperCase.length; i++ ) {
      const thisArticleWord = articleWordsUpperCase[i]

      const wordsArray = []
      if (basicInclusionCondition(thisArticleWord)) {
          const thisArticleWordLower = thisArticleWord.toLowerCase()
          if (
              acronymWordCondition(thisArticleWord)
              || capitalWordCondition(thisArticleWord)
          ) {
              if (
                  capitalWordCondition(thisArticleWord)
                  && single_capital.all.indexOf(thisArticleWordLower) === -1
              ) {
                  single_capital.all.push(thisArticleWordLower)
              }

              else if (
                  acronymWordCondition(thisArticleWord)
                  && single_acronym.all.indexOf(thisArticleWordLower) === -1
              ) {
                  single_acronym.all.push(thisArticleWordLower)
              }

              const multiArray = [
                articleWordsUpperCase[i],
                articleWordsUpperCase[i-1],
                articleWordsUpperCase[i-2],
                articleWordsUpperCase[i-3],
                articleWordsUpperCase[i-4],
                articleWordsUpperCase[i-5],
                articleWordsUpperCase[i-6],
                articleWordsUpperCase[i-7],
              ]

              let consecutiveArray = []

              for (let j = 0; j < multiArray.length; j++ ) {
                  if (consecutiveArray.length === j) {

                      const thisWord = multiArray[j]
                      const nextWord = multiArray[j+1]

                      // if (thisWord === 'handmaid') {
                      //     console.log({thisWord})
                      // }
                      if (
                          basicInclusionCondition(thisWord) && capitalWordCondition(thisWord)
                          || consecutiveArray.length > 0 && joiningWordCondition(thisWord) && basicInclusionCondition(nextWord) && capitalWordCondition(nextWord)
                          || consecutiveArray.length > 1 && exceptionWhenTitleCase(thisWord)

                      ) {
                          consecutiveArray.push(thisWord.toLowerCase())
                      }
                  }
              }


              if (consecutiveArray.length > 1) {
                  consecutiveArray = consecutiveArray.reverse()
                  const multiCapitalWords = consecutiveArray.join(' ')
                  initialMultiCapital.push(multiCapitalWords)
              }
          }
      }
    }



    const multiCapitalReverse = initialMultiCapital.reverse()
    const multi_capital = {}
    multi_capital.all = []
    let multiCapitalString = ''
    multiCapitalReverse.forEach((item) => {
        if (multiCapitalString.includes(item) === false) {
            multiCapitalString = `${multiCapitalString} ${item}`
            multi_capital.all.push(item)
        }
    })



    multi_capital.frequent = []

    multi_capital.all.forEach((multiWord) => {
        const words = multiWord.split(/[\W]/)
        words.forEach((word) => {
            if (
                frequency_analysis.array.indexOf(word) > -1
                && multi_capital.frequent.indexOf(multiWord) === -1
            ) {
                multi_capital.frequent.push(multiWord)
            }
        })
    })

    // console.log({single_capital})

    // console.log({upper_analysis})
    return {multi_capital, single_acronym, single_capital}
}

function capitalWordCondition (word) {
  const condition1 = word[0] === word[0].toUpperCase()
  const condition2 = word.match(/\d/) === null
  const condition3 = !acronymWordCondition(word)
  return condition1 && condition2 && condition3
}

function joiningWordCondition (word) {
  const listOfJoiningWords = [
      'the',
      'of',
      's',
      'for',
      'de',
      'l',
      'da',
      'du',
      'le',
      'la',
      'al',
      'von',
      'der',
      'van',
      'bin',
      'e',
      'i',
      'il',
    //   'and',
      'in',
  ]

  const c1 = listOfJoiningWords.indexOf(word) > -1
  return c1
}



function acronymWordCondition (word) {
  const condition1 = word === word.toUpperCase()
  const condition2 = word.match(/\d/) === null
  return condition1 && condition2
}

function numberWordCondition (word) {
  const condition1 = word === word.toUpperCase()
  const condition2 = word.match(/\d/) !== null
  return condition1 && condition2
}

function exceptionWhenTitleCase (word) {
  const exceptionWords = [
      'New',
      'The',
      'United',
  ]

  if (word) {
    const c1 = exceptionWords.indexOf(word) > -1
    return c1
  } else {
    return false
  }

}

module.exports = {
    processUpperCase,
}
