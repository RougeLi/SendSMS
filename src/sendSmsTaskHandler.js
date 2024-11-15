const {getTargetSendTasks, getMessageMap, sendMessages} = require("./lib/sendSmsTaskHelper");
const getSenderStrategy = require("./lib/getSenderStrategy");

async function main() {
    const sendJobTopicDescribe = process.env.SEND_JOB_TOPIC_DESCRIBE;
    if (!sendJobTopicDescribe) {
        console.error('缺少 SEND_JOB_TOPIC_DESCRIBE 環境變數');
        return;
    }
    const targetSendTasks = await getTargetSendTasks(sendJobTopicDescribe);
    const distinctMessageIds = [...new Set(targetSendTasks.map(task => task.messageId))];
    console.log("distinctMessageIds:", distinctMessageIds);
    const messageMap = await getMessageMap(distinctMessageIds);
    console.log("messageMap:", messageMap);
    const Sender = getSenderStrategy(process.env.SENDER_MODE);

    await sendMessages({
        messageMap,
        targetSendTasks,
        Sender
    });
}

main().catch(e => console.error(e));
