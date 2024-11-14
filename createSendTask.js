const prisma = require('./prisma');

async function checkExistingSendTask(daskData) {
    const {jobDescribe, mobile, coupon} = daskData;
    return await prisma.sendTask.findFirst({
        where: {
            jobDescribe,
            mobile,
            coupon,
        },
    });
}

async function createNewSendTask(daskData) {
    const {jobDescribe, mobile, coupon, messageId} = daskData;
    const isSent = false;
    return await prisma.sendTask.create({
        data: {
            jobDescribe,
            mobile,
            coupon,
            messageId,
            isSent,
        },
    });
}

/**
 * @typedef {Object} TaskData
 * @property {string} jobDescribe - 任務描述
 * @property {string} mobile - 用戶手機號碼
 * @property {String} coupon - 優惠代碼
 * @property {number} messageId - MessageTemplate ID
 */

/**
 * 建立新的 SendTask 資料（如果不存在）
 * @param {TaskData} daskData - Task任務數據對象
 * @returns {Promise<void>}
 */
module.exports = async function createSendTask(daskData) {
    try {
        const existingTask = await checkExistingSendTask(daskData);

        if (existingTask) {
            console.log('資料已存在:', existingTask);
            return;
        }

        const newSendTask = await createNewSendTask(daskData);
        console.log('新建的 SendTask:', newSendTask);
    } catch (error) {
        console.error('建立 SendTask 時發生錯誤:', error);
        throw error;
    }
};
