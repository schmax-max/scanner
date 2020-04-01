'use strict'

const {extractData} = require('./extractData')
const {analysis} = require('./analysis')

module.exports = {
    extract
}

async function extract (content_url) {
    // console.log(`running content ${content_url}`)
    try {
        const response = await extractData (content_url)
        const {error, extracted_url, data, frame_compatible} = response
        if (error) {
            return response
        } else {
            const content = await analysis (extracted_url, data, frame_compatible)
            return content
        }
    } catch (error) {
        console.log({error})
        return
    }

}
