function getLocalDateTimeString(options) {
    const date = new Date();

    // 使用 Intl.DateTimeFormat 格式化日期
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(date);

    // 提取各部分
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;

    return `${year}${month}${day}_${hour}${minute}`;
}

function getTaiwanLocalDateTimeString() {
    const options = {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    return getLocalDateTimeString(options);
}

module.exports = {
    getTaiwanLocalDateTimeString,
}
