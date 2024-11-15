const {prisma} = require('./prisma');

function checkExistingSendTask(sendTaskData) {
    const {taskTopic, mobile, coupon} = sendTaskData;
    return prisma.sendTask.findFirst({
        where: {
            taskTopic,
            mobile,
            coupon,
        },
    });
}

function createNewSendTask(sendTaskData) {
    const {taskTopic, mobile, coupon, messageId} = sendTaskData;
    return prisma.sendTask.create({
        data: {
            taskTopic,
            mobile,
            coupon,
            messageId,
        },
    });
}


/**
 * 建立新的 SendTask 資料（如果不存在）
 * @param {SendTaskData} sendTaskData - SendTask 資料
 * @returns {Promise<void>}
 */
module.exports = async function createSendTask(sendTaskData) {
    try {
        const existingTask = await checkExistingSendTask(sendTaskData);
        if (existingTask) {
            console.log('資料已存在:', existingTask);
            return;
        }
        const newSendTask = await createNewSendTask(sendTaskData);
        console.log('新建的 SendTask:', newSendTask);
    } catch (error) {
        console.error('建立 SendTask 時發生錯誤:', error);
        throw error;
    }
};
