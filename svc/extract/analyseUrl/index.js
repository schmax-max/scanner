module.exports = {
    analyseUrl
}

function analyseUrl (original_content_url) {
    if (!original_content_url || original_content_url === undefined) {
        console.log(`undefined content_url in analyseUrl`)
        return {}
    } else {
        let content_url = cleanUrl (original_content_url)
        if (!content_url) {
            console.log(`issue with analyseUrl for ${original_content_url}`)
            return {}
        }
        let url_slugs = []
        const is_content = ensureContentUrl (content_url)
        let unique_slug
        const date = {}
        let urlIdentifierArray = []
        content_url.split('/').forEach((slug, index) => {
            potentiallyAddSlugToIdentifierUrl (slug, index, urlIdentifierArray)
            if (index > 0) {
                unique_slug = determineUniqueSlug (slug, unique_slug)
                determineDateSlugs (slug, date)
            }
            if (slug.length > 1) {
                url_slugs.push(slug)
            }
        })
        const url_domain = url_slugs[0]
        const content_type = getContentType (url_domain, url_slugs)
        const url_identifier = urlIdentifierArray.join('/')

        return {
            url_slugs,
            url_domain,
            url_identifier,
            unique_slug,
            is_content,
            content_type,
            date
        }
    }
}

function getContentType (url_domain, url_slugs) {
    url_domain = url_domain.split('.')[0]
    let content_type = 'article'
    const identifiers = {
        podcast: {
            domains: [
                'soundcloud',
                'acast',
                'itunes',
                'spotify',
            ],
            slugs: [
                'podcast',
                'audio'
            ]
        },
        video: {
            domains: [
                'youtube',
                'youtu',
                'vimeo'
            ],
            slugs: [
                'watch',
                'video',
            ]
        },
        book: {
            domains: [
                'amazon'
            ],
            slugs: [
                'book'
            ]
        },
        photo: {
            domains: [

            ],
            slugs: [
                'photo',
                'photos'
            ]
        }

    } 
    

    for (type in identifiers) {
        const {domains, slugs} = identifiers[type]
        if (domains.indexOf(url_domain) > -1) {
            content_type = type
        }
        slugs.forEach((slug) => {
            if (url_slugs.indexOf(slug) > -1) {
                content_type = type
            }
        })
    }

    return content_type
}

function cleanUrl (content_url) {
    content_url.toLowerCase()
    const splitIndicators = [
        '//www.',
        '//',
    ]
    const regExSplitIndicators = new RegExp(splitIndicators.join('|'));
    return content_url.split(regExSplitIndicators)[1]
}


function potentiallyAddSlugToIdentifierUrl (slug, index, urlIdentifierArray) {
    
    if (
        slug.split('-').length < 4
        && (slug.length < 15 || index === 0)
        && (getMonthIndex (slug) === -1)
        && slug.toLowerCase() !== slug.toUpperCase()
        && urlIdentifierArray.length === index
    ) {
        urlIdentifierArray.push(slug)
    }
}

function ensureContentUrl (content_url) {
    const excludedItems = [
        '.ico',
        '.rss',
        '.png',
        '/png',
        '.svg',
        '.woff2',
        '.css',
        '.json',
        '.xml',
        '.js',
        "\\",
        "\n",
        "\t",
        "download.",
        ".download",
    ]

    const excludedItemsRegEx = new RegExp(excludedItems.join('|'));

    return !excludedItemsRegEx.test(content_url)

}

function determineUniqueSlug (slug, unique_slug) {
    if (slug.length > 15 || slug.split('-').length > 2) {
        unique_slug = slug
    }
    return unique_slug
}

function determineDateSlugs (slug, date) {
    if (slug.length === 4 && isNaN(slug) === false) {
        date.year = slug
    } else if (date.year && !date.month) {
        determinMonthSlug (slug, date)
    } else if (date.year && date.month && slug.length < 3) {
        date.day = slug
    }
}

function determinMonthSlug (slug, date) {
    if (slug.length < 3) {
        date.month = slug
    } else if (slug.length === 3) {
        const monthIndex = getMonthIndex (slug)
        if (monthIndex > -1) {
            date.month = monthIndex + 1
        }
    }
}

function getMonthIndex (slug) {
    const monthsArrayShort = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec'
    ]

    const monthsArrayLong = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
    ]
    
    const monthIndexShort = monthsArrayShort.indexOf(slug)
    const monthIndexLong = monthsArrayLong.indexOf(slug)
    return Math.max(monthIndexShort, monthIndexLong)
}
