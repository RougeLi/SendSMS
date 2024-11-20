const {prisma} = require('../prisma');

/**
 * 儲存`三竹簡訊`回應日誌
 * @param {MitakeResponse | MitakeErrorResponse} response
 */
async function saveMitakeLog(response) {
    try {
        await prisma.mitakeResponseLog.create({
            data: response,
        });
    } catch (err) {
        console.error('儲存 Mitake SMS Log 回應時發生錯誤：', err);
    }
}

module.exports = {saveMitakeLog};
