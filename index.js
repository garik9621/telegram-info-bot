require('dotenv').config()
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const {weatherCommand} = require('./src/weatherCommand')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)

bot.start((ctx) => ctx.reply(`Welcome! Добро пожаловать! ${ctx.update.message.from.first_name}, я pug terminator info bot. Возможно Игорь меня не забросит и реализует различные приколюхи тут. Пока что можно только получить информацию о текущей погоде в Волгограде. Просто отправь мне /weather.`))

bot.command('weather', async (ctx) => {
    await weatherCommand(ctx);
})

let gigaExpiresTime;
let gigaAccessToken;
bot.command('giga', async (ctx) => {
    const requestText = ctx.update.message.text.replace('/giga', '');

    const date = new Date();

    if (!gigaExpiresTime || gigaExpiresTime < date.getTime()) {
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'RqUID': uuidv4(),
                'Authorization': `Basic ${btoa(`${process.env.GIGA_API_CLIENT_SECRET}:${process.env.GIGA_AUTH_DATA_KEY}`)}`
            },
            data: {
                'scope': 'GIGACHAT_API_PERS'
            }
        };

        try {
            const { access_token, expires_at } = await axios(config);
            gigaAccessToken = access_token;
            gigaExpiresTime = expires_at;
        } catch (e) {
            console.log(e)
            return;
        }
    }

    const config = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${gigaAccessToken}`
        },
        data: {
            model: "GigaChat:latest",
            messages: [
                {
                    role: "user",
                    content: requestText
                }
            ],
            temperature: 1.0,
            top_p: 0.1,
            n: 1,
            stream: false,
            max_tokens: 512,
            repetition_penalty: 1
        }
    }

    try {
        const response = await axios(config);

        ctx.reply(response.choices.message.content)
    } catch (e) {
        console.log(e)
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))