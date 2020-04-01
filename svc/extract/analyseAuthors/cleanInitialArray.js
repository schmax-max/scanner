const {normaliseName, extractAuthorNameFromUrl} = require('./helpers')

module.exports = {cleanInitialArray}

function cleanInitialArray (initialArray) {
  
  return initialArray.reduce((newArray, individualItem) => {
    if (individualItem.length < 100) {
      let normalisedName
      if (individualItem.includes('://')) {
        const authorNameInLink = processLinksInAuthorArray(individualItem)
        if (authorNameInLink) {
          normalisedName = normaliseName(authorNameInLink)   
        }
      } else {
        if (individualItem.split(' ').length > 1) {
          normalisedName = normaliseName(individualItem)
        }
      }
      if (normalisedName && newArray.indexOf(normalisedName) === -1) {
        newArray.push(normalisedName)
      } 
    }
    return newArray
  }, [])
}


function processLinksInAuthorArray (url) {
  const socialMedia = [
      'facebook.com',
      'instagram.com',
      'pinterest.com',
      'twitter.com',
      'youtube.com',
  ]
  const regExSocialMediaIndicators = new RegExp(socialMedia.join('|'));
  if (regExSocialMediaIndicators.test(url)) {
      return null
  } else {
      const authorNameInItem = extractAuthorNameFromUrl(url)
      if (authorNameInItem === null) {
          return null
      } else if (authorNameInItem.split(' ').length > 1) {
          return authorNameInItem
      } else {
          return null
      }
  }
}

