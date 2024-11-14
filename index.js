const prisma = require('./prisma');

const createMessageTemplate = require('./createMessageTemplate')

async function main() {
    const description = '親愛的顧客，歡迎回來漢堡王！限時回饋活動開跑！結帳時輸入您的專屬折購碼【{{coupon}}】即可享受特別優惠。快來享用美味的漢堡吧！活動詳情請至門市查詢。'
    await createMessageTemplate(description);

    //const allMessageTemplates = await prisma.messageTemplate.findMany();
    //console.log("所有的 MessageTemplate 資料:", allMessageTemplates);

    const allSendTasks = await prisma.sendTask.findMany();

    allSendTasks.forEach(sendTask => {
        if (sendTask.jobDescribe === '測試2') return;
        if (sendTask.isSent) {
            console.log(`mobile: ${sendTask.mobile} passed.`);
            return;
        }
        console.log(`mobile: ${sendTask.mobile}`);
        console.log(replacePlaceholders(description, sendTask));
    })

}

function replacePlaceholders(template, variables) {
    return template.replace(/{{(.*?)}}/g, (match, key) => {
        return variables[key.trim()] || match;
    });
}

main().catch(e => console.error(e));
