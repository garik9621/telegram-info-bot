const {v4: uuidv4} = require("uuid");
const qs = require("qs");
const axios = require("axios");
let gigaExpiresTime;
let gigaAccessToken;

async function gigaCommand(ctx) {
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
                'Authorization': `Basic ${process.env.GIGA_AUTH_DATA_KEY}`
            },
            data: qs.stringify({
                scope: 'GIGACHAT_API_PERS'
            })
        };

        try {
            const { data: {access_token, expires_at} } = await axios(config);
            gigaAccessToken = access_token;
            gigaExpiresTime = expires_at;
        } catch (e) {
            ctx.reply(e)
            return;
        }
    }

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${gigaAccessToken}`
        },
        data: JSON.stringify({
            model: "GigaChat",
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
        })
    }

    try {
        const { data } = await axios(config);

        ctx.reply(data.choices[0].message.content)
    } catch (e) {
        ctx.reply(e)
    }
}

module.exports = {
    gigaCommand
}