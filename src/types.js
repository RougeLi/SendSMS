/**
 * @typedef {Object} SendTaskData
 * @property {string} taskTopic - 任務主題
 * @property {string} mobile - 用戶手機號碼
 * @property {String} coupon - 優惠代碼
 * @property {number} messageId - 模板訊息 id
 */

/**
 * @typedef {Object} TargetSendTaskData
 * @property {string} taskId - 任務 UUID
 * @property {string} mobile - 用戶手機號碼
 * @property {number} messageId - 模板訊息 id
 * @property {String} coupon - 優惠代碼
 */

/**
 * @typedef {number} messageId
 * @description 模板訊息 id
 */

/**
 * @typedef {string} template
 * @description 字串模板
 */

/**
 * @typedef {Object.<messageId, template>} MessageMap
 * @description MessageMap 是一個物件，使用 messageId 作為鍵（數字型別），對應的值為模板字串（字串型別）。
 */

/**
 * @typedef {typeof BaseSmsSender} SmsSenderClass
 * @description 繼承自 BaseSmsSender 的簡訊發送類別構造函數
 */
