const {prisma, SENT_STATUS_SUCCESS} = require("../prisma");

/**
 * 簡訊發送基底類別
 * @class
 */
module.exports = class BaseSmsSender {
    /**
     * @param {TargetSendTaskData} targetSendTaskData - 發送任務資料
     * @param {string} description - 訊息描述
     */
    constructor(targetSendTaskData, description) {
        this.targetSendTaskData = targetSendTaskData;
        this.description = description;
    }

    /**
     * 實際發送訊息的方法
     * @returns {Promise<void>}
     */
    async send() {
        throw new Error('send method must be implemented');
    }

    /**
     * 執行發送任務
     * @returns {Promise<void>}
     */
    async execute() {
        try {
            await this.send();
            await this.markAsSuccess();
        } catch (error) {
            console.error(error);
        }
    }

    async markAsSuccess() {
        await prisma.sendTask.update({
            where: {taskId: this.targetSendTaskData.taskId},
            data: {
                sentStatus: SENT_STATUS_SUCCESS
            },
        });
    }
};
