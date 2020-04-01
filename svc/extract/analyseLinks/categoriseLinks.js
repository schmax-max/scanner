module.exports = {categoriseLinks}

function categoriseLinks (linksArray, domain) {
  const links = {}
  linksArray.forEach((link) => {
    const linkType = determineLinkType (link, domain)
    links[linkType] = links[linkType] || []
    const isNewLink = links[linkType].indexOf(link) === -1
    if (isNewLink) {
        links[linkType].push(link)
    }
  })

  return links
}


function determineLinkType (link, domain) {
  let linkType = 'external'
  
  const types = [
      'facebook',
      'instagram',
      'pinterest',
      'twitter',
      'amazon',
      'reddit',
      'youtube',
  ]
  if (link.includes(`${domain}`)) {
    linkType = 'internal'
  } else {
      for (let i=0; i<types.length; i++) {
          const type = types[i]
          if (link.includes(`${type}.`)) {
              linkType = type
          }
      }
  }
  
  return linkType
}




