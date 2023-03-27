const getDataStructurePattern = (lang) => {
    const patterns = {
        en: { acceptableValues: ["Events", "Births", "Deaths"], finishTag: "Holidays and observances" },
        pt: { acceptableValues: ["Eventos históricos", "Nascimentos", "Mortes"], finishTag: "Feriados e eventos cíclicos" }
    }

    return patterns[lang]
}

module.exports = getDataStructurePattern