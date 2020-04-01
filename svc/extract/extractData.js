const axios = require('axios')
const {getSpecificUrl} = require('./helpers')
const {bugsnagReport} = require('../../config')

module.exports = {extractData}

async function extractData (url) {
    // bugsnagReport()
    // console.log(`starting extractData ${url}`)
  try {
      const {headers, data} = await axios({
          method: 'get',
          url: url,
          timeout: 0.2 * 60 * 1000 // every 0.2 minutes
      })
      if (!data) {
          return bugsnagReport ('no data from url pull', undefined, {url})
      } else if (data.includes('���')) {
          return bugsnagReport ('url pull gives distorted data', undefined, {url})
      } else if (typeof(data) !== 'string') {
          return bugsnagReport ('url pull gives other than string', undefined, {url})
      } else {
          const extracted_url = getSpecificUrl (data, 'canonical') || getSpecificUrl (data, 'og:url') || url

          let frame_compatible = true
          if (headers["x-frame-options"]) {
              frame_compatible = false
          }
          return { data, extracted_url, frame_compatible }
      }
  
  } catch (err) {
    //   console.log({err})
      let error = ''
      if (err.code === 'ENOTFOUND') {
          error = 'url pull has no internet connection'
      } else if (err.code === 'ECONNRESET') {
          error = 'url pull not attempted properly'
      } else if (err.code === 'ECONNABORTED') {
          error = 'url pull timed out'
      } else if (err.code === 'ECONNREFUSED') {
          error = 'url pull was denied connection'
      } else if (err.response !== undefined) {
          if (err.response.statusText !== undefined && err.response.status !== undefined) {
              error = `url pull returned ${err.response.status} error with ${err.response.statusText}`
          } else {
              error = 'url pull has error response, but error is not defined'
          }
      } else {
          error = 'url pull has other fundamental problem'
      }
      bugsnagReport('issue with extractData', error, {url})
      return undefined
  }
}


