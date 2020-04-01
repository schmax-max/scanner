const levenshtein = require('fast-levenshtein')

module.exports = {getAuthorsArray}

function getAuthorsArray (initialCollection, initialArray) {
  const mergedArray = mergeAuthorArrays (initialCollection, initialArray)
  return removeDuplicateAuthors (mergedArray)
}

function removeDuplicateAuthors (mergedAuthorArray) {
  let authorNamesIncluded = []
  let authorUrlsIncluded = []
  let finalAuthorArray = []

  mergedAuthorArray.forEach((authorObject) => {
    const {author_name, author_url} = authorObject
    if (
        (authorNamesIncluded.indexOf(author_name) === -1)
        && (authorUrlsIncluded.indexOf(author_url) === -1)
    ) {
        finalAuthorArray.push(authorObject)
        authorNamesIncluded.push(author_name)
        authorUrlsIncluded.push(author_url)
    }
  })
  return finalAuthorArray
}

function mergeAuthorArrays (initialCollection, initialArray) {
  const inBothArrays = identifyOverlappingAuthorNames (initialCollection, initialArray)
  let finalAuthorArray = []
  if (inBothArrays.inBothArraysObject.length > 0) {
      finalAuthorArray = inBothArrays.inBothArraysObject
  } else if (initialCollection.length < 3) {
      finalAuthorArray = initialCollection
  } else {
      if (initialArray.length > 0) {
          initialArray.reduce((newArray, item) => {
              if (inBothArrays.inBothArraysInitial.indexOf(item) === -1) {
                  const authorObject = { author_name: item }
                  finalAuthorArray.push(authorObject)
              }
              return newArray
          }, [])
      } else {
          finalAuthorArray = initialCollection
      }
  }
  return finalAuthorArray
}


function identifyOverlappingAuthorNames (initialCollection, initialArray) {
// console.log({initialArray, initialCollection})
  const inBothArraysInitial = []
  const inBothArraysObject = []
  initialArray.reduce((newArrayInitial, itemInitial) => {
      initialCollection.reduce((newArrayObjects, itemObject) => {
          const distance = levenshtein.get(itemInitial, itemObject.author_name)
          const distanceProportion = +(distance / (itemInitial.length)).toFixed(3)
          if (distanceProportion < 0.2) {
              inBothArraysInitial.push(itemInitial)
              inBothArraysObject.push(itemObject)
          }
          return newArrayObjects
      }, [])
      return newArrayInitial
  }, [])
  return { inBothArraysInitial, inBothArraysObject }
}

