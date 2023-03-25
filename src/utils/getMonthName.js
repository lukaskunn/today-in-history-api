const getMonthName = (lang, monthNumber) => {
    const months = require(`./months/${lang}.js`)

    return months[monthNumber]
}

module.exports = getMonthName