const puppeteer = require("puppeteer")
const validateDay = require("../utils/validateDate.js")
const validateLanguage = require("../utils/validateLanguage.js")
const getStringParam = require("../utils/getStringParam.js")
const getDataStructurePattern = require("../utils/patterns/dataStructurePattern.js")
class DateController {

    static getWikipediaData = async (req, res) => {
        const { language } = req.params
        const day = req.params.day || new Date().getDate()
        const month = req.params.month || new Date().getMonth() + 1

        const dayIsValid = validateDay(day, month)
        const langIsValid = validateLanguage(language)

        if (dayIsValid && langIsValid) {
            const stringMonthDayURL = getStringParam(language, day, month)
            const dataStructurePattern = getDataStructurePattern(language)
            const charCodeSplit = language == "pt" ? "—" : "–"

            const currentStateMarker = {
                [dataStructurePattern.acceptableValues[0]]: "historical_events",
                [dataStructurePattern.acceptableValues[1]]: "births",
                [dataStructurePattern.acceptableValues[2]]: "deaths",
            }

            const browser = await puppeteer.launch()
            const page = await browser.newPage()


            await page.goto(`https://${language}.wikipedia.org/wiki/${stringMonthDayURL}`, {
                waitUntil: 'networkidle2'
            })

            await page.waitForSelector('div.mw-parser-output');

            const returnedEvents = await page.$$eval('div.mw-parser-output > ul, div.mw-parser-output > h2', rows => {
                return Array.from(rows, row => {
                    const col = row.querySelectorAll('li, span.mw-headline')
                    return Array.from(col, c => c.textContent.trim().replace(/['"]+/g, ''))
                })
            })

            const eventsObj = {
                historical_events: {
                    title: "",
                    events: []
                },
                births: {
                    title: "",
                    events: []
                },
                deaths: {
                    title: "",
                    events: []
                }
            }

            let currentState = "historical_events"

            for (let i = 0; i < returnedEvents.length; i++) {
                if (returnedEvents[i][0] == dataStructurePattern.finishTag) {
                    break
                } else {
                    if (dataStructurePattern.acceptableValues.includes(returnedEvents[i][0])) {
                        currentState = currentStateMarker[returnedEvents[i][0]]
                        eventsObj[currentState].title = returnedEvents[i][0]
                    } else {
                        returnedEvents[i].map((uniqueEvent) => {
                            if (uniqueEvent.split(charCodeSplit)[1] != undefined || uniqueEvent.split("\n")[1] != undefined) {
                                let resultObject = {
                                    year: "",
                                    [currentState == "historical_events" ? "events" : "peoples"]: []
                                }

                                if (uniqueEvent.split(charCodeSplit)[1] != undefined) {
                                    resultObject.year = uniqueEvent.split(charCodeSplit)[0].trim()
                                    resultObject[currentState == "historical_events" ? "events" : "peoples"].push(uniqueEvent.split(charCodeSplit)[1].split("[")[0].trim())
                                } else if (uniqueEvent.split("\n")[1] != undefined) {
                                    resultObject.year = uniqueEvent.split("\n")[0].trim()
                                    for (let k = 1; k < uniqueEvent.split("\n").length; k++) {
                                        resultObject[currentState == "historical_events" ? "events" : "peoples"].push(uniqueEvent.split("\n")[k].split("[")[0].trim())
                                    }
                                }

                                eventsObj[currentState].events.push(resultObject)
                            }
                        })
                    }
                }
            }


            res.status(200).send({ content: eventsObj })

            await browser.close()
        } else {
            res.status(400).send({
                message: `wrong url param, please check and send request again`, params: {
                    language,
                    day,
                    month
                }
            })
        }
    }
}

module.exports = DateController