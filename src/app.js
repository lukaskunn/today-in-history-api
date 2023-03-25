const express = require("express")
const puppeteer = require("puppeteer")

const getMonthName = require("./utils/getMonthName.js")
const validateDay = require("./utils/validateDate.js")
const validateLanguage = require("./utils/validateLanguage.js")
const getStringParam = require("./utils/getStringParam.js")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send({ message: "page running" })
})

app.get("/:language/:day/:month", async (req, res) => {
    const { language, day, month } = req.params
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

        const tempEvents = [
            {
                title: "",
                events: []
            },
            {
                title: "",
                events: []
            },
            {
                title: "",
                events: []
            }
        ]

        const titles = await page.$$eval('div.mw-parser-output > h2', rows => {
            return Array.from(rows, row => {
                const col = row.querySelectorAll('span.mw-headline')
                return Array.from(col, c => c.textContent.trim().replace(/['"]+/g, ''))
            })
        })

        const events = await page.$$eval('div.mw-parser-output > ul', rows => {
            return Array.from(rows, row => {
                const col = row.querySelectorAll('li')
                return Array.from(col, c => c.textContent.trim().replace(/['"]+/g, ''))
            })
        })

        for (let i = 0; i < tempEvents.length; i++) {
            tempEvents[i].title = titles[i][0]
        }

        tempEvents[0].events.push(events[0])
        tempEvents[0].events.push(events[1])
        tempEvents[0].events.push(events[2])

        tempEvents[1].events.push(events[0])
        tempEvents[1].events.push(events[1])
        tempEvents[1].events.push(events[2])

        tempEvents[2].events.push(events[0])
        tempEvents[2].events.push(events[1])
        tempEvents[2].events.push(events[2])


        res.status(200).send({ content: tempEvents[1] })

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
})

module.exports = app