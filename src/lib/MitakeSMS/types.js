/**
 * 三竹簡訊設定檔
 * @typedef {Object} MitakeSMSConfig
 * @property {string} SmSendApiUrl - 設定 API 網址
 * @property {string} [CharsetURL] - 設定 API 編碼格式 (選填 - Big5/UTF-8 預設為 Big5)
 * @property {string} username - 三竹簡訊帳號
 * @property {string} password - 三竹簡訊密碼
 * @property {string} [dlvtime] - 簡訊預約時間 (選填)
 * @property {string} [vldtime] - 簡訊有效期限 (選填)
 * @property {string} [response] - 狀態主動回報網址 (選填)
 * @property {string} [smsPointFlag] - 預設值為0，若值等於1時，回覆結果會加上smsPoint，該筆簡訊的扣除點數。 (選填)
 */

/**
 * 三竹簡訊 API 回應物件
 * @typedef {Object} MitakeResponse
 * @property {string} clientId - 客戶端 ID，即為task_id
 * @property {string} msgId - 簡訊序號
 * @property {string} statusCode - 發送狀態碼
 * @property {number} accountPoint - 帳戶剩餘點數
 * @property {string} [duplicate] - 是否為重複發送的簡訊
 * @property {number} [smsPoint] - 簡訊的扣除點數
 */

/**
 * 三竹簡訊 API 錯誤回應物件
 * @typedef {Object} MitakeErrorResponse
 * @property {string} clientId - 客戶端 ID，即為task_id
 * @property {string} statusCode - 發送狀態碼
 * @property {string} error - 錯誤訊息
 */
