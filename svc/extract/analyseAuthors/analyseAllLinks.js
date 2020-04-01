const {normaliseName, extractAuthorNameFromUrl} = require('./helpers')

module.exports = {analyseAllLinks}

function analyseAllLinks (apiResponse, domainName) {
  let initialCollection = []
  let authorNamesInLinks = []

  const linkArray = apiResponse.split('href="')
  linkArray.shift()

  linkArray.reduce((newArray, element) => {
      let link = element.split('"')[0]

      let similarLinkEnd = ''
      if (link[link.length] === '/') {
          similarLinkEnd = link.substring(0, link.length - 1)
      } else {
          similarLinkEnd = `${link}/`
      }

      if (
          newArray.indexOf(link) === -1
          && newArray.indexOf(similarLinkEnd) === -1
      ) {
          // newArray.push(link) // to ensure it doesn't double-count links / authors
          const authorNameInLink = extractAuthorNameFromUrl(link)
          if (link.includes('http') && link.includes(domainName) === false) {

          } else {
              if (link.includes('http') === false) {
                  if (link[0] === '/') {
                    link = `https://www.${domainName}${link}`
                    const link2 = `https://www.${domainName}${link}`
                    newArray.push(link)
                    newArray.push(link2)
                  } else {
                    link = `https://${link}`
                    const link2 = `https://${link}`
                    newArray.push(link)
                    newArray.push(link2)
                  }
              }

              if (authorNameInLink !== null && authorNamesInLinks.indexOf(authorNameInLink) === -1) {
                  const authorObject = {
                      author_name: authorNameInLink,
                      author_url: link
                  }
                  initialCollection.push(authorObject)
                  authorNamesInLinks.push(authorNameInLink)
              }
          }
      }

      return newArray
  }, [])
  return initialCollection
}
