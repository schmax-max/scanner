module.exports = {cleanLink}

function cleanLink (link, domain) {
  link = removeMultipleHostsIfNeeded (link)
  link = addHostIfNeeded (link, domain)
  link = normaliseLinkIfNeeded (link)
  if (
      link.includes('://') 
      && checkForExclusion (link) 
      && ensureSlug (link)
  ) {
      return link
  } else {
      return
  }
}



function removeMultipleHostsIfNeeded (link) {
    const linkArray = link.split('http')
    if (linkArray.length > 2) {
        link = `http${linkArray[1]}`
    }
    return link
}

function addHostIfNeeded (link, domain) {
    if (link.substring(0, 4) !== 'http') {
        if (link.substring(0, 2) === '//') {
            const domainAndSlug = link.split('//')[1]
            link = `https://${domainAndSlug}`
        } else if (link[0].includes('/')) {
            link = `https://${domain}${link}`
        } 
    }
    return link
}


function normaliseLinkIfNeeded (link) {
  
  const linksWithQuestionMarks = [
      'youtube.com',
      'youtu.be',
      'medium.com'
  ]
  
  const linksWithQuestionMarksRegEx = new RegExp(linksWithQuestionMarks.join('|'))
  if (!link.match(linksWithQuestionMarksRegEx)) {
      link = link.split('?')[0]
  }
  link.replace('/amp/', '/')
  return link
}

function ensureSlug (link, domain) {
    const slug = link.split('//')[1]
    let slugArray = []
    if (slug) {
        slugArray = slug.split('/')
    }
    
    slugArray = removeLastIfEmpty (slugArray)
    return slugArray.length > 3
}

function removeLastIfEmpty (slugArray) {
    const last = slugArray.pop()
    if (last.length > 0) {
        slugArray.push
    }
    return slugArray
}



function checkForExclusion (link) {
  const linkExcluders = [
      '.ico',
      '.rss',
      '.png',
      '.svg',
      '.woff2',
      '.css',
      '.json',
      '.xml',
      '.js',
      // 'google.com',
      // 'amazon.com',
      // 'amzn.to',
      // 'linkedin.com',
      // 'instagram.com',
      // 'twitter.com',
      // 'facebook.com',
      'nextdraft',
      'campaign-archive.com',
      '.pdf',
      'reddit',
      'thebulwark.com',
      'http://howtokeepgoing.net', // common in austinkleon
      'austinkleon.com',
      'ribbonfarm.com',
      'nowiknow.com',
      'patreon.com',
      'itunes.apple.com',
      'journals.sagepub.com',
      'curated.co/',
      'list-manage.com',
      'marketfolly.com',
      'blogger.com',
      'nathan.ai',
      'https://capx.co/help-us-defend-popular-capitalism/',
      'https://capx.co/subscribe',
      'http://www.capx.co/feed/',
      'https://getpocket.com/@pockethits', // common in Pocket
      'https://getpocket.com/signup', // common in Pocket
      'https://getpocket.com/explore/rss/pocket-hits', // common in Pocket
      'cdnjs.cloudflare.com', // common in Pocket
      'getrevue.co', // common in AI Newsletter
      'futurecrun.ch', // common in Future Crunch newsletter
      'forward-to-friend.com', // common in Future Crunch newsletter
      'gmpg.org', // common in Now I Know
      'dlewis.net', // common in Now I Know
      'netdna-ssl.com', // common in Ribbon farm
      'refactorcamp.org', // commin in Ribbon Farm
      '://us1.', // common in Future Crunch newsletter
      '://us8.', // common in Austin Kleon newsletter
      'eepurl.com', // common in Austin Kleon newsletter
      'gallery.mailchimp.com', // common in Austin Kleon newsletter
      'wikipedia.org', // common in Austin Kleon newsletter
      'steallikeanartist.com', // common in Austin Kleon newsletter
      'mailchi.mp', // common in Austin Kleon newsletter
      'googleapis.com', // common in thebulwark
      '//t.co/', // twitter statuses
      'github.com', // common in hackernews
      'ycombinator.com', // common in hackernews
      'mozilla.org', // common in nextdraft
      'gravatar.com', // common in nextdraft
      'public-api.wordpress.com/oembed/' // common in nextdraft
  ]
  const linkExcludersRegEx = new RegExp(linkExcluders.join('|'))
  return !link.match(linkExcludersRegEx)
}
