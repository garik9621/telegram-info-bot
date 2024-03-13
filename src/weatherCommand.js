const axios = require("axios");

async function weatherCommand(ctx) {
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

        const date = new Date();
        const timeString = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`

        ctx.reply(
            `${ctx.update.message.from.first_name}, сейчас в Волгограде ${date.toLocaleDateString()} ${timeString}\nСейчас температура ${Math.round(data.main.temp)}°C, ощущается как ${Math.round(data.main.feels_like)}°C
        `);
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
}

module.exports = {
    weatherCommand
};