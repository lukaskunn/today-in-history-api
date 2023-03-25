const getMonthName = require("./getMonthName.js")

const getStringParam = (lang, day, month) => {
    const monthName = getMonthName(lang, month)
    const string = {
        en: `${monthName}_${day}`,
        pt: `${day}_de_${monthName}`
    }

    return string[lang]
}

module.exports = getStringParam