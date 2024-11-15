/**
 * 範例簡訊發送器
 * @class
 * @extends BaseSmsSender
 */
module.exports = class ExampleSmsSender extends require('./BaseSmsSender') {
    async send() {
        const delay = Math.floor(Math.random() * 10) + 1;
        await new Promise((resolve) => setTimeout(resolve, delay));
        const mobile = this.targetSendTaskData.mobile;
        const message = this.description;
        const length = `訊息長度: ${message.length}`;
        const sendResult = {mobile, message, length};
        console.log('發送簡訊結果:', sendResult);
    }
}
