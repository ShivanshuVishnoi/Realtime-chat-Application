function formatMessage(userName, text) {

    return {
        userName,
        text,
        time: new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short', hourCycle: 'h12' }),
    };
}

module.exports = formatMessage;