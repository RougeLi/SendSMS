const sendSms = require("../MitakeSMS/MitakeSMSClient");
const {saveMitakeLog} = require("../MitakeSMS/MitakeSMSLog");

/**
 * 三竹簡訊發送器
 * @class
 * @extends BaseSmsSender
 */
module.exports = class MitakeSmsSender extends require('./BaseSmsSender') {
    async send() {
        await saveMitakeLog(
            await sendSms(this.targetSendTaskData, this.description)
        );
    }
}
