const {sendSms} = require("../TeamplusSMS/TeamplusSMSClient");
const {saveTeamplusLog} = require("../TeamplusSMS/TeamplusSMSLog");

/**
 * teamplus簡訊發送器
 * @class
 * @extends BaseSmsSender
 */
module.exports = class TeamplusSmsSender extends require('./BaseSmsSender') {
    async send() {
        await saveTeamplusLog(
            await sendSms(this.targetSendTaskData, this.description)
        );
    }
}
