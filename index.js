require('dotenv').config()
const { Telegraf, Markup} = require('telegraf')
const {weatherCommand} = require('./src/weatherCommand')
const {gigaCommand} = require('./src/gigaCommand')
const {pictureCommand} = require("./src/pictureCommand");
const path = require('path')
const {message} = require("telegraf/filters");
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

bot.command('picture', async (ctx) => {
    await pictureCommand(ctx);
})

bot.hears('buttons', (ctx) => {
    ctx.reply('Choose your destiny', Markup.keyboard(['search', 'ads']).oneTime().resize())
})

bot.hears('search', (ctx) => {
    ctx.reply('you pressed search button');
})

bot.hears('ads', (ctx) => {
    ctx.reply('you pressed ads button');
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))