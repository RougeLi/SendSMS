/**
 * 動態載入簡訊發送類別的工廠函數
 * @param {string} SenderMode - 簡訊發送模式名稱
 * @returns {SmsSenderClass} - 繼承自 BaseSmsSender 的簡訊發送類別
 * @throws {Error} 當找不到對應的 SenderMode 時拋出錯誤
 */
module.exports = (SenderMode) => {
    try {
        return require(`./sms-sender/${SenderMode}`);
    } catch (e) {
        throw new Error(`找不到對應的 SenderMode: ${SenderMode}`);
    }
}
