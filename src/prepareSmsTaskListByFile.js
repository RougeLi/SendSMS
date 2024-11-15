const fs = require('fs');
const readline = require('readline');
const {join} = require("node:path");
const createSendTask = require('./lib/createSendTask');

const TASK_FILES_DIRECTORY = join(__dirname, '..', 'taskFiles');

async function main() {
    const sendTaskMessageId = process.env.SEND_TASK_MESSAGE_ID;
    if (!sendTaskMessageId) {
        console.error('缺少 SEND_TASK_MESSAGE_ID 環境變數');
        return;
    }
    const messageId = parseInt(sendTaskMessageId, 10);
    const sendTaskListFilename = process.env.SEND_TASK_LIST_FILENAME;
    if (!sendTaskListFilename) {
        console.error('缺少 SEND_TASK_LIST_FILENAME 環境變數');
        return;
    }
    const filePath = join(TASK_FILES_DIRECTORY, sendTaskListFilename);
    console.log({filePath});
    const lineReader = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });
    try {
        for await (const line of lineReader) {
            const [mobile, coupon] = line.split(',');
            if (!mobile) {
                console.error(`缺少手機號碼，無效的資料行: ${line}`);
                continue;
            }
            if (!coupon) {
                console.error(`缺少優惠代碼，無效的資料行: ${line}`);
                continue;
            }
            try {
                await createSendTask({
                    taskTopic: sendTaskListFilename,
                    mobile: mobile.trim(),
                    coupon: coupon.trim(),
                    messageId,
                });
            } catch (error) {
                console.error(`處理 ${mobile}, ${coupon} 時發生錯誤:`, error);
            }
        }
        console.log('檔案處理完畢。');
    } catch (error) {
        console.error('處理檔案時發生錯誤:', error);
    }
}

main().catch(e => console.error(e));
