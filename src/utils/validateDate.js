const validateDay = (day, month) => {
    const monthMaxDay = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= monthMaxDay[month]) {
        return true
    }

    return false
}

module.exports = validateDay