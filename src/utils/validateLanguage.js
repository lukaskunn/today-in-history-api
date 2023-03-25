const validateLanguage = (lang) => {
    const availableLanguages = [
        "pt", "en"
    ]

    return availableLanguages.includes(lang)
}

module.exports = validateLanguage