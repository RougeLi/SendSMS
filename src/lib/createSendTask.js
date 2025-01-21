const {prisma} = require('./prisma');

const BATCH_SIZE = 100; // 一次批處理的數量

/**
 * 依據傳入的資料 (taskTopic, mobile, coupon) 進行批量查詢
 * 用 OR 查詢所有可能的組合，避免重複與資料庫多次呼叫。
 * @param {SendTaskData[]} dataList
 */
async function findExistingSendTasks(dataList) {
    const conditions = dataList.map((d) => ({
        taskTopic: d.taskTopic,
        mobile: d.mobile,
        coupon: d.coupon,
    }));
    return prisma.sendTask.findMany({
        where: {
            OR: conditions,
        },
    });
}

/**
 * 建立新的 SendTask 資料（如果不存在），以批量方式處理。
 * @param {SendTaskData[]} sendTaskDataList
 * @returns {Promise<void>}
 */
module.exports = async function createSendTask(sendTaskDataList) {
    // 使用切塊方式，每次處理 BATCH_SIZE 筆資料
    for (let i = 0; i < sendTaskDataList.length; i += BATCH_SIZE) {
        const chunk = sendTaskDataList.slice(i, i + BATCH_SIZE);

        try {
            // 1. 先查詢這批資料中，哪些已經存在
            const existingTasks = await findExistingSendTasks(chunk);

            // 2. 將已存在的組合 (taskTopic-mobile-coupon) 存進 Set，方便後續過濾
            const existingSet = new Set(
                existingTasks.map(
                    (sendTask) => `${sendTask.taskTopic}-${sendTask.mobile}-${sendTask.coupon}`
                )
            );

            // 3. 過濾掉已存在的資料，只保留尚未建立的
            const dataToCreate = chunk
                .filter((d) => {
                    const key = `${d.taskTopic}-${d.mobile}-${d.coupon}`;
                    return !existingSet.has(key);
                })
                .map((sendTaskData) => ({
                    taskTopic: sendTaskData.taskTopic,
                    mobile: sendTaskData.mobile,
                    coupon: sendTaskData.coupon,
                    messageId: sendTaskData.messageId,
                }));

            // 4. 若有需要建立的新資料，則使用 createMany 批量新增
            if (dataToCreate.length > 0) {
                await prisma.sendTask.createMany({
                    data: dataToCreate,
                });
                console.log(`成功批量新增 ${dataToCreate.length} 筆資料`);
            } else {
                console.log('本批資料皆已存在，無需新增');
            }

        } catch (error) {
            console.error('建立 SendTask 時發生錯誤:', error);
            throw error;
        }
    }
};
