const puppeteer = require("puppeteer")
const getMonthName = require("../utils/getMonthName")
const validateDay = require("../utils/validateDate.js")
const validateLanguage = require("../utils/validateLanguage.js")
const getStringParam = require("../utils/getStringParam.js")

class DateController {

    static getWikipediaData = async (req, res) => {
        const { language } = req.params
        const day = req.params.day || new Date().getDate()
        const month = req.params.month || new Date().getMonth() + 1

        const dayIsValid = validateDay(day, month)
        const langIsValid = validateLanguage(language)

        if (dayIsValid && langIsValid) {
            const monthName = getMonthName(language, month)
            const stringMonthDayURL = getStringParam(language, day, month)

            const browser = await puppeteer.launch()
            const page = await browser.newPage()


            await page.goto(`https://${language}.wikipedia.org/wiki/${stringMonthDayURL}`, {
                waitUntil: 'networkidle2'
            })

            await page.waitForSelector('div.mw-parser-output');

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

            const titles = await page.$$eval('div.mw-parser-output > h2', rows => {
                return Array.from(rows, row => {
                    const col = row.querySelectorAll('span.mw-headline')
                    return Array.from(col, c => c.textContent.trim().replace(/['"]+/g, ''))
                })
            })

            for (let i = 0; i < eventsObj.length; i++) {
                eventsObj[i].title = titles[i][0]
            }

            const events = await page.$$eval('div.mw-parser-output > ul', rows => {
                return Array.from(rows, row => {
                    const col = row.querySelectorAll('li')
                    return Array.from(col, c => c.textContent.trim().replace(/['"]+/g, ''))
                })
            })

            console.log(events)

            events[0].map((uniqueEvent) => {
                eventsObj.historical_events.events.push(uniqueEvent)
            })
            events[1].map((uniqueEvent) => {
                eventsObj.historical_events.events.push(uniqueEvent)
            })
            events[2].map((uniqueEvent) => {
                eventsObj.historical_events.events.push(uniqueEvent)
            })

            events[3].map((uniqueEvent) => {
                eventsObj.births.events.push(uniqueEvent)
            })
            events[4].map((uniqueEvent) => {
                eventsObj.births.events.push(uniqueEvent)
            })
            events[5].map((uniqueEvent) => {
                eventsObj.births.events.push(uniqueEvent)
            })

            events[6].map((uniqueEvent) => {
                eventsObj.deaths.events.push(uniqueEvent)
            })
            events[7].map((uniqueEvent) => {
                eventsObj.deaths.events.push(uniqueEvent)
            })
            events[8].map((uniqueEvent) => {
                eventsObj.deaths.events.push(uniqueEvent)
            })

            res.status(200).send({ content: eventsObj })

            console.log(titles)

            await browser.close()
            console.log(monthName)
            console.log(stringMonthDayURL)
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