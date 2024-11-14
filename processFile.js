const fs = require('fs');
const path = require('path');
const readline = require('readline');
const createSendTask = require('./createSendTask');

const messageId = 1;
const jobDescribe = '測試';
const filePath = path.join(__dirname, 'tasks', jobDescribe);

const fileStream = fs.createReadStream(filePath);

const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});

rl.on('line', async (line) => {
    const [mobile, coupon] = line.split(',');

    if (!mobile) {
        console.error(`缺少手機號碼，無效的資料行: ${line}`);
        return;
    }
    if (!coupon) {
        console.error(`缺少優惠代碼，無效的資料行: ${line}`);
        return;
    }

    try {
        await createSendTask({
            jobDescribe,
            mobile: mobile.trim(),
            coupon: coupon.trim(),
            messageId
        });
    } catch (error) {
        console.error(`處理 ${mobile}, ${coupon} 時發生錯誤:`, error);
    }
});

rl.on('close', () => {
    console.log('檔案處理完畢。');
});
