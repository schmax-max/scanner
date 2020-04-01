
module.exports = {normaliseName, extractAuthorNameFromUrl}

function normaliseName (authorName) {
  authorName = authorName.replace(/[^a-zA-Z\s]/g, '')
  authorName = authorName.toLowerCase()
  let authorNameArray = authorName.split(' ')
  authorNameArray = authorNameArray.reduce((newArray, item) => {
      item = stringToTitleCase(item)
      if (item.includes('Mc')) {
          item = `${item.charAt(0)}${item.charAt(1)}${item.charAt(2).toUpperCase()}${item.substr(3)}`
      } else if (item.includes('Mac')) {
          item = `${item.charAt(0)}${item.charAt(1)}${item.charAt(2)}${item.charAt(3).toUpperCase()}${item.substr(4)}`
      }
      newArray.push(item)
      return newArray
  }, [])
  const normalisedAuthorName = authorNameArray.join(' ')
  return normalisedAuthorName
}

function stringToTitleCase (stringInput) {
  return stringInput.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}


function extractAuthorNameFromUrl (url) {
  const authorIndicators = [
      '/by/',
      '/contributor/',
      '/contributors/',
      '/user/',
      '/users/',
      '/profile/',
      '/profiles/',
      '/editor/',
      '/editors/',
      '/author/',
      '/authors/',
      '/writer/',
      '/writers/',
      '/staff/'
  ]
  const regExAuthorIndicators = new RegExp(authorIndicators.join('|'));
  const authorNameBlock = url.split(regExAuthorIndicators)[1]
  if (!authorNameBlock) {
      return null
  } else if (url === 'https://www.theatlantic.com/writers/') {
      return null
  } else {
      let authorNameInUrl = authorNameBlock.split('/')[0]
      if (authorNameInUrl.length < 4) {
          return null
      } else {
          authorNameInUrl = authorNameInUrl.replace(/[^a-zA-Z\s]/g, ' ')
          authorNameInUrl = normaliseName(authorNameInUrl)
          return authorNameInUrl
      }
  }
}
