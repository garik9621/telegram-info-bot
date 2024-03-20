const axios = require("axios");

async function pictureCommand(ctx) {
    const [, ...pictureText] = ctx.update.message.text.split(' ');

    try {
        const { data } = await axios({
            method: 'get',
            url: `https://api.unsplash.com/search/photos`,
            headers: {
                'Accept-Version': 'v1',
                Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`
            },
            params: {
                query: pictureText.join(' '),
                per_page: 100
            }
        })

        if (data?.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * (data.results.length - 1));
            ctx.replyWithPhoto(data.results[randomIndex].links.download)
            return
        }

        ctx.reply('Изображение не найдено :(')

    } catch(e) {
        ctx.reply(e);
        ctx.reply('Изображение не найдено :(')
    }
}

module.exports = {
    pictureCommand
}