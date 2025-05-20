/**
 * teamplus簡訊設定檔
 * @typedef {Object} TeamplusSMSConfig
 * @property {string} SiteUrl - API 網址
 * @property {string} custcode - 客戶代碼
 * @property {string} uid - 帳號
 * @property {string} pwd - 密碼
 * @property {string} [retrytime] - 簡訊有效期限 (選填)
 */

/**
 * teamplus簡訊 API 回應物件
 * @typedef {Object} TeamplusResponse
 * @property {string} clientId - 客戶端 ID，即為task_id
 * @property {string} status - 回應狀態碼
 * @property {string} message - 回應訊息
 * @property {string} batchid - 批次ID
 * @property {string} credit - 帳戶剩餘點數
 * @property {string} sendcnt - 發送筆數
 * @property {string} reducepoint - 扣除點數
 * @property {string} unsendcnt - 未發送筆數
 */

/**
 * teamplus簡訊 API 錯誤回應物件
 * @typedef {Object} TeamplusErrorResponse
 * @property {string} clientId - 客戶端 ID，即為task_id
 * @property {string} status - 錯誤狀態碼
 * @property {string} message - 錯誤訊息
 */
