const {prisma} = require('./prisma');

function checkExistingTemplate(description) {
    return prisma.messageTemplate.findUnique({
        where: {
            description,
        },
    })
}

function createNewMessageTemplate(description) {
    return prisma.messageTemplate.create({
        data: {
            description,
        },
    });
}

/**
 * 建立新的 MessageTemplate 資料（如果不存在）
 * @param {string} description - 描述內容
 * @returns {Promise<void>} - 新建的 MessageTemplate 資料或 null（如果已存在）
 * @exampleDescription - 親愛的顧客，歡迎回來漢堡王！限時回饋活動開跑！結帳時輸入您的專屬折購碼【{{coupon}}】即可享受特別優惠。快來享用美味的漢堡吧！活動詳情請至門市查詢。
 */
module.exports = async (description) => {
    try {
        const existingTemplate = await checkExistingTemplate(description);
        if (existingTemplate) {
            console.log('已存在的 MessageTemplate:', existingTemplate);
            return;
        }
        await createNewMessageTemplate(description);
        console.log('建立新的 MessageTemplate:', description);
    } catch (error) {
        console.error('建立 MessageTemplate 時發生錯誤:', error);
        throw error;
    }
};
