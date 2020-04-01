const URL = require('url')

module.exports = {getSpecificUrl, getDomain}

function getDomain (url) {
  let {hostname} = URL.parse(url)
  if (hostname) {
      hostname = hostname.replace('www.', '')
  }
  return hostname
}


function getSpecificUrl (data, identifier) {
  let preData = trimExcess (data, identifier, 'pre')
  preData = trimExcess (preData, '<', 'final')

  let postData = trimExcess (data, identifier, 'post')
  postData = trimExcess (postData, '>', 'pre')
  let amp_url
  if (preData.includes('http')) {
      amp_url = getUrl (preData)
  } else if (postData.includes('http')) {
      amp_url = getUrl (postData)
  }
  return amp_url
}

function getUrl (data) {
  data = trimExcess (data, 'http', 'post')
  data = trimExcess (data, '"', 'pre')
  return `http${data}`
}


function trimExcess (data, identifier, keep) {
  if (!data) {
      // console.log('no data')
      return data
  }
  let array = data.split(identifier)
  if (keep === 'pre') {
      return array[0]
  } else if (keep === 'post') {
      array.shift()
      return array.join(identifier)
  } else if (keep === 'final') {
      return array[array.length - 1]
  } else {
      console.log('no impact of trimExcess')
      return data
  }
}


// function extractCorrectUrl (inputUrl, data) {
//   let extractedUrl = ''
//   let extractedUrlBlockPost = ''
//   let extractedUrlBlockPre = ''
//   if (data.includes('canonical')) {
//       // console.log('canonical?')
//       extractedUrlBlockPre = data.split('canonical')[0]
//       extractedUrlBlockPost = data.split('canonical')[1]

//       extractedUrlBlockPre = extractedUrlBlockPre.split('<').slice(-1)[0]
//       extractedUrlBlockPost = extractedUrlBlockPost.split('>')[0]


//   } else if (data.includes('og:url')) {
//       // console.log('og:url?')
//       extractedUrlBlockPre = data.split('og:url')[0]
//       extractedUrlBlockPost = data.split('og:url')[1]

//       extractedUrlBlockPre = extractedUrlBlockPre.split('<').slice(-1)[0]
//       extractedUrlBlockPost = extractedUrlBlockPost.split('>')[0]
//   } else {

//       if (
//           inputUrl.includes('bloomberg.com')
//           || inputUrl.includes('ft.com')
//       ) {

//       } else {
//           console.log(`not picking up original website url for ${inputUrl}`)
//       }
//   }

//   // else if (data.includes('rel="canonical')) {
//   //     extractedUrlBlockPre = data.split('rel="canonical')[0]
//   // } else if (data.includes("property='og:url")) {
//   //     extractedUrlBlockPre = data.split("og:url")[0]
//   // }


//   let extractedUrlBlockUsed = ''
//   if (extractedUrlBlockPost.includes('http')) {
//       extractedUrlBlockUsed = extractedUrlBlockPost
//   } else if (extractedUrlBlockPre.includes('http')) {
//       extractedUrlBlockUsed = extractedUrlBlockPre
//   }
//   extractedUrl = extractedUrlBlockUsed.split('http')
//   extractedUrl = extractedUrl.slice(-1)[0]
//   extractedUrl = extractedUrl.split('"')[0]
//   extractedUrl = extractedUrl.split("'")[0]
//   extractedUrl = extractedUrl.split("?")[0]
//   extractedUrl = `http${extractedUrl}`

//   if (
//       extractedUrl.includes('http') === true
//       && extractedUrl.length < 200
//       && extractedUrl.length > 10
//   ) {
//       return extractedUrl
//   } else {
//       return inputUrl
//   }
// }