require('dotenv').config()
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const {weatherCommand} = require('./src/weatherCommand')
const {gigaCommand} = require('./src/gigaCommand')
const axios = require('axios')
const qs = require('qs')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
process.env.NODE_EXTRA_CA_CERTS= path.resolve(__dirname, 'certificates')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)

bot.start((ctx) => ctx.reply(`Welcome! Добро пожаловать! ${ctx.update.message.from.first_name}, я pug terminator info bot. Возможно Игорь меня не забросит и реализует различные приколюхи тут. Пока что можно только получить информацию о текущей погоде в Волгограде. Просто отправь мне /weather. И пообщаться с чат-ботом: для этого вводи команду /giga и свой вопрос`))

bot.command('weather', async (ctx) => {
    await weatherCommand(ctx);
})

bot.command('giga', async (ctx) => {
    await gigaCommand(ctx);
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))