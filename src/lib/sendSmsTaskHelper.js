const {prisma, SENT_STATUS_PENDING} = require("./prisma");

/**
 * 發送訊息
 * @param {Object} options - 發送訊息的選項
 * @param {MessageMap} options.messageMap - 簡訊模板映射
 * @param {TargetSendTaskData[]} options.targetSendTasks - 發送任務資料陣列
 * @param {SmsSenderClass} options.Sender - 簡訊發送類別
 * @returns {Promise<void>}
 */
async function sendMessages({messageMap, targetSendTasks, Sender}) {
    for (const sendTask of targetSendTasks) {
        const template = messageMap[sendTask.messageId];
        const description = replacePlaceholders(template, sendTask);
        await new Sender(sendTask, description).execute();
    }
    // const sendTasks = targetSendTasks.map(async (sendTask) => {
    //     const template = messageMap[sendTask.messageId];
    //     const description = replacePlaceholders(template, sendTask);
    //     await new Sender(sendTask, description).execute();
    // });
    //
    // await Promise.allSettled(sendTasks);
}

/**
 * 取得符合條件的 SendTask 資料
 * @param {string} taskTopic - 任務主題
 * @param {SentStatus} sentStatus - 是否已發送，預設為 false
 * @returns {Promise<TargetSendTaskData[]>} - 符合條件的 SendTask 資料
 */
function getTargetSendTasks(taskTopic, sentStatus = SENT_STATUS_PENDING) {
    const where = {
        taskTopic,
        sentStatus
    }
    const select = {
        taskId: true,
        mobile: true,
        messageId: true,
        coupon: true
    };
    return prisma.sendTask.findMany({
        select, where,
    });
}

/**
 * 取得 MessageTemplate ID 對應的訊息描述
 * @param {number[]} messageIds - MessageTemplate ID 陣列
 * @returns {Promise<MessageMap>} - MessageMap 物件
 */
async function getMessageMap(messageIds) {
    const select = {
        id: true,
        description: true
    };
    const where = {
        id: {in: messageIds}
    };
    const messageTemplates = await prisma.messageTemplate.findMany({
        select, where,
    });
    const messageMap = {};
    messageTemplates.forEach(template => {
        messageMap[template.id] = template.description;
    });
    return messageMap;
}

/**
 * 替換佔位符
 * @param {string} template - 模板字串
 * @param {object} variables - 變數對應表
 * @returns {string} - 替換後的字串
 */
function replacePlaceholders(template, variables) {
    return template.replace(/{{(.*?)}}/g, (match, key) => {
        const trimmedKey = key.trim();
        if (variables.hasOwnProperty(trimmedKey)) {
            return variables[trimmedKey];
        }
        console.warn(`警告：未找到佔位符 "${trimmedKey}" 的對應值。`);
        return match;
    });
}

module.exports = {
    sendMessages,
    getTargetSendTasks,
    getMessageMap,
};
