require('dotenv').config()
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const axios = require('axios')

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)

bot.start((ctx) => ctx.reply(`Welcome! Добро пожаловать! ${ctx.update.message.from.first_name}, я pug terminator info bot. Возможно Игорь меня не забросит и реализует различные приколюхи тут. Пока что можно только получить информацию о текущей погоде в Волгограде. Просто отправь мне /weather.`))

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.command('weather', async (ctx) => {
    const requestForecastConfig = {
         method: 'get',
         url: 'http://api.openweathermap.org/data/2.5/weather',
         params: {
             q: 'Volgograd,ru',
             appid: process.env.FORECAST_API_KEY,
             units: 'metric'
         }
    }

    try {

        // {
        //     coord: { lon: 44.5018, lat: 48.7194 },
        //     weather: [
        //         { id: 801, main: 'Clouds', description: 'few clouds', icon: '02n' }
        //     ],
    //         base: 'stations',
        //     main: {
                //     temp: -2.57,
                //         feels_like: -5.45,
                //         temp_min: -2.95,
                //         temp_max: -2.57,
                //         pressure: 1027,
                //         humidity: 74
                //      },
        //              visibility: 10000,
        //              wind: { speed: 2, deg: 270 },
        //              clouds: { all: 20 },
        //              dt: 1710269097,
        //         sys: {
                    //     type: 1,
                    //         id: 8973,
                    //         country: 'RU',
                    //         sunrise: 1710213679,
                    //         sunset: 1710255734
                    // },
//                  timezone: 10800,
        //         id: 472757,
        //     name: 'Volgograd',
        //     cod: 200
        // }


        const { data } = await axios(requestForecastConfig);
        console.log(new Date(data.dt))
        const date = new Date(data.dt);

        ctx.reply(
            `${ctx.update.message.from.first_name}, сейчас в Волгограде ${date.toLocaleDateString()}\nСейчас температура ${Math.round(data.main.temp)}°C, ощущается как ${Math.round(data.main.feels_like)}°C
        `)

        // console.log(data)
    } catch(e) {
        const errorCode = e?.response?.data?.cod;

        if (errorCode === 401) {
            ctx.reply('Что-то не так с доступом к сервису погоды')
            return
        }

        if (errorCode === 429) {
            ctx.reply('Превышен лимит запросов к сервису погоды')
            return
        }

        console.log(e)
        ctx.reply('Что-то пошло не так')
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))