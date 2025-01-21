const fs = require('fs');
const readline = require('readline');
const {join} = require('path');
const createSendTask = require('./lib/createSendTask');
const colorText = require("./lib/colorText");
const {getTaiwanLocalDateTimeString} = require("./lib/getLocalDateTimeString");

// 設定檔案路徑
const TASK_FILES_DIRECTORY = join(__dirname, '..', 'taskFiles');
// 是否跳過優惠代碼模式
const SKIP_COUPON_MODE = process.env.PREPARE_SKIP_COUPON_MODE === 'true';
// 是否儲存重複的手機號碼
const SAVE_DUPLICATE_MOBILE = process.env.PREPARE_SAVE_DUPLICATE_MOBILE === 'true';
// 一次在記憶體中暫存多少筆再送到 createSendTask
const CHUNK_READ_SIZE = 1000;
// 用 Set 來記錄已經讀取過的手機號碼，避免重複
const mobileSet = new Set();
// 用來記錄重複的手機號碼
const duplicateMobiles = [];

main().catch((e) => console.error(colorText(e, 'red')));

async function main() {
    const messageId = getMessageId();
    const taskTopic = getTaskTopic();
    const sendTaskListFilename = getSendTaskListFilename();
    const taskListLineReader = getTaskListLineReader(sendTaskListFilename);

    let buffer = [];

    for await (const taskLine of taskListLineReader) {
        const sendTaskData = parseLineToSendTask(taskLine, taskTopic, messageId);
        if (!sendTaskData) {
            continue;
        }

        // 加入暫存
        buffer.push(sendTaskData);

        // 如果已達預設的上限，就批量寫入 DB
        if (buffer.length >= CHUNK_READ_SIZE) {
            try {
                await createSendTask(buffer);
                console.log(colorText(`本批已寫入 ${buffer.length} 筆資料`, 'cyan'));
            } catch (error) {
                console.error(colorText('批量建立 SendTask 時發生錯誤:', 'red'), colorText(error, 'red'));
                throw error;
            } finally {
                // 清空暫存，繼續讀下一批
                buffer = [];
            }
        }
    }

    // 結束後，如果還有剩餘資料，最後再寫一次
    if (buffer.length > 0) {
        try {
            await createSendTask(buffer);
            console.log(colorText(`最後一批已寫入 ${buffer.length} 筆資料`, 'cyan'));
        } catch (error) {
            console.error(colorText('批量建立 SendTask 時發生錯誤:', 'red'), colorText(error, 'red'));
            throw error;
        }
    }

    console.log(colorText('檔案處理完畢。', 'magenta'));

    handleDuplicateMobiles(taskTopic);
}

function parseLineToSendTask(taskLine, taskTopic, messageId) {
    let [mobile, coupon] = taskLine.split(',');

    // 確認手機號碼格式
    if (!mobile) {
        console.error(colorText(`缺少手機號碼，無效的資料行: ${taskLine}`, 'red'));
        return null;
    }

    // 檢查是否重複手機
    if (mobileSet.has(mobile)) {
        duplicateMobiles.push(mobile);
        return null;
    } else {
        mobileSet.add(mobile);
    }

    // 確認優惠代碼格式
    if (!coupon) {
        if (!SKIP_COUPON_MODE) {
            console.error(colorText(`缺少優惠代碼，無效的資料行: ${taskLine}`, 'red'));
            return null;
        }
        coupon = 'N/A';
    }

    return {
        taskTopic,
        mobile,
        coupon,
        messageId,
    };
}

function getMessageId() {
    const sendTaskMessageId = process.env.PREPARE_TASK_MESSAGE_ID;
    if (!sendTaskMessageId) {
        throw new Error(colorText('缺少 PREPARE_TASK_MESSAGE_ID 環境變數', 'red'));
    }
    console.log(colorText(`訊息 ID: ${sendTaskMessageId}`, 'blue'));
    return parseInt(sendTaskMessageId, 10);
}

function getSendTaskListFilename() {
    const sendTaskListFilename = process.env.PREPARE_TASK_LIST_FILENAME;
    if (!sendTaskListFilename) {
        throw new Error(colorText('缺少 PREPARE_TASK_LIST_FILENAME 環境變數', 'red'));
    }
    console.log(colorText(`檔案名稱: ${sendTaskListFilename}`, 'blue'));
    return sendTaskListFilename;
}

function getTaskTopic() {
    const taskTopic = process.env.PREPARE_TASK_TOPIC;
    if (!taskTopic) {
        throw new Error(colorText('缺少 PREPARE_TASK_TOPIC 環境變數', 'red'));
    }
    console.log(colorText(`任務主題: ${taskTopic}`, 'blue'));
    return taskTopic;
}

function getTaskListLineReader(sendTaskListFilename) {
    const filePath = join(TASK_FILES_DIRECTORY, sendTaskListFilename);
    console.log(colorText(`開始處理檔案: ${filePath}`, 'yellow'));
    return readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });
}

function handleDuplicateMobiles(taskTopic) {
    if (duplicateMobiles.length > 0) {
        console.error(colorText(`有 ${duplicateMobiles.length} 筆重複的手機號碼`, 'yellow'));
        if (!SAVE_DUPLICATE_MOBILE) {
            return;
        }
        const duplicateFileName = join(
            TASK_FILES_DIRECTORY,
            `${taskTopic}-${getTaiwanLocalDateTimeString()}-重複手機號碼.txt`
        );
        fs.writeFileSync(duplicateFileName, duplicateMobiles.join('\n'));
        console.log(colorText(`重複手機號碼已存檔至: ${duplicateFileName}`, 'yellow'));
    }
}
