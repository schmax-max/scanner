
function processPureContent (pureContent) {
    const quotesArrays = pureContent.match(/“/g || [])
    const sentencesArrays = pureContent.match(/\./g || [])
    let quotes = 0
    let sentences = 0
    if (quotesArrays) { quotes = quotesArrays.length }
    if (sentencesArrays) { sentences = sentencesArrays.length }


    let paras = pureContent.split(/\r?([\n]{1,}|[\r]{1,}|[ ]{2,})/g)

    let longParas = []
    let shortParas = []
    let contentParas = []
    let excerptParas = []
    
    paras.forEach((individualPara) => {
        if (individualPara.length > 150) { longParas.push(individualPara) }
        if (individualPara.length > 50 && individualPara.length <= 150 ) { shortParas.push(individualPara) }
        if (individualPara.length > 50 ) { contentParas.push(individualPara) }
        if (individualPara.length > 75 ) { excerptParas.push(individualPara) }
    })
    const long_paras = longParas.length
    const short_paras = shortParas.length
    const contentParaCount = contentParas.length

    let excerpt = ''
    if (excerptParas.length > 0) {
        excerpt = excerptParas[0]
    } else if (short_paras > 0) {
        excerpt = shortParas[0]
    }

    const content = contentParas.join(' ')
    const noCharacterContent = content.replace(/[^áÁéÉíÍóÓúÚñÑüÜÆæØøÅåÄäÖöÜüẞßœŒôÔîÏïÎëËêÊèÈéÉçÇâÂàÀÿŸûÛùÙŠšČčĆćŽžA-Za-z\-\s\d\’\']/g, " ")
    
    const articleWordsUpperCase = noCharacterContent.split(/[\W]/)
    const wordCount = articleWordsUpperCase.length

    const noCharacterContentLowerCase = noCharacterContent.toLowerCase()
    const articleWordsLowerCase = noCharacterContentLowerCase.split(/[\W]/)

    const counts = {
      quotes,
      sentences,
      short_paras,
      long_paras,
      words: wordCount
    }

    const words_per = {
        para: +(wordCount / Math.max(contentParaCount, 1)).toFixed(1),
        long_para: +(wordCount / Math.max(long_paras, 1)).toFixed(1),
        quote: +(wordCount / Math.max(quotes, 1)).toFixed(1),
        sentence: +(wordCount / Math.max(sentences, 1)).toFixed(1),
    }

    return {
        excerpt,
        content,
        counts,
        words_per,
        wordCount,
        articleWordsUpperCase,
        articleWordsLowerCase
    }
}

module.exports = {
    processPureContent,
}
