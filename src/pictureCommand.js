const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// TODO найти free api для картинок
async function pictureCommand(ctx) {
    const [, ...pictureText] = ctx.update.message.text.split(' ');

    try {
        const { data: pageCode } = await axios.get(`https://yandex.ru/images/search?text=${pictureText.join('')}`)

        const dom = new JSDOM(pageCode);
        const targetImage = dom.window.document.querySelector('.page-layout')?.querySelector('img');

        const targetImageSrc = targetImage?.getAttribute('src');

        if (targetImageSrc) {
            ctx.replyWithPhoto(targetImageSrc)
            return
        }

        ctx.reply('Изображение не найдено :(')

    } catch(e) {
        ctx.reply(e);
        console.log(e)
    }
}

module.exports = {
    pictureCommand
}