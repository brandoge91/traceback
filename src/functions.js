const urls = {
    "avatar": " https://roblox-avatar.eryn.io",
    "bloxlink": "https://v3.blox.link/developer/discord/",
    "rover": 'https://verify.eryn.io/api/user/'
}

const fs = require('fs');

const axios = require('axios');

async function getUserAvatarUrl(id) {
    const url = urls.avatar + "/" + id;
    const response = await axios.get(url).catch(() => {
        return "https://tr.rbxcdn.com/4f4ec8776ecfa2bf6552f33a0af19460/420/420/Avatar/Png";
    })
    // get the url we were redirected to
    let avatarUrl
    if (response.request?.res.responseUrl) {
     avatarUrl = response.request?.res.responseUrl
    } else {
         avatarUrl = "https://tr.rbxcdn.com/4f4ec8776ecfa2bf6552f33a0af19460/420/420/Avatar/Png";
    }
    return avatarUrl;
}

async function getRoverUser(id) {
    const url = urls.rover + id;
    const response = await axios.get(url).catch(() => {
        return {
            "robloxUsername": "Unknown"
        }
    })
    return response.data;
}

async function getBloxlinkUser(id) {
    const url = urls.bloxlink + id;
    const api_key = ''

    const response = await axios.get(url, {
        headers: {
            'api-key': api_key
        }
    });
    return response.data;
}

getUserAvatarUrl("12341242").then(console.log);

getRoverUser('785248634458996767').then(console.log);

getBloxlinkUser('785248634458996767').then(console.log);

module.exports = {
    getUserAvatarUrl,
    getRoverUser,
    getBloxlinkUser
}
