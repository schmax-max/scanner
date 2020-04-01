function processFrequency (frequency_analysis, single_capital, single_acronym) {
    
    const single_lower = {}
    single_lower.frequent = []

    // const single_capital_frequent = {
    //     collection: [],
    //     counter: 0
    // }
    // const single_acronym_frequent = {
    //     collection: [],
    //     counter: 0
    // }
    // const single_lower_frequent = {
    //     collection: [],
    //     counter: 0
    // }

    frequency_analysis.collection.forEach((item) => {
        if (single_capital.all.indexOf(item.word) > -1) {
            // single_capital_frequent.collection.push(item)
            // single_capital_frequent.counter += item.count
            single_capital.frequent.push(item.word)
        }

        else if (single_acronym.all.indexOf(item.word) > -1) {
            // single_acronym_frequent.collection.push(item)
            // single_acronym_frequent.counter += item.count
            single_acronym.frequent.push(item.word)
        }

        else {
            // single_lower_frequent.collection.push(item)
            // single_lower_frequent.counter += item.count
            single_lower.frequent.push(item.word)
        }
    })
    // const frequency_analysis = {
    //     frequency_analysis,
    //     // single_capital_frequent,
    //     // single_acronym_frequent,
    //     // single_lower_frequent
    // }

    return {single_lower}
}

module.exports = {
    processFrequency,
}
