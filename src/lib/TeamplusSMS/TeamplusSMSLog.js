const {prisma} = require('../prisma');

/**
 * 儲存`teamplus簡訊`回應日誌
 * @param {TeamplusResponse | TeamplusErrorResponse} response
 */
async function saveTeamplusLog(response) {
    try {
        await prisma.teamplusResponseLog.create({
            data: response,
        });
    } catch (err) {
        console.error('儲存 Teamplus SMS Log 回應時發生錯誤：', err);
    }
}

module.exports = {saveTeamplusLog};
