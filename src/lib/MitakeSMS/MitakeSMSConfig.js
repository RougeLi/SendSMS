const loadConfig = require('../config');

const CONFIG_FILE_NAME = 'mitake-sms-config';

/**
 * @type {MitakeSMSConfig}
 */
const MITAKE_SMS_CONFIG = loadConfig(CONFIG_FILE_NAME);

// Check required keys
[
    'SmSendApiUrl',
    'username',
    'password',
].forEach((key) => {
    if (!MITAKE_SMS_CONFIG[key]) {
        throw new Error(`${CONFIG_FILE_NAME} file missing required key: ${key}`);
    }
});

/**
 * 三竹簡訊 API 位置，包含編碼配置
 * @type {string} SmSendApiUrl
 */
const SmSendApiUrl = (MITAKE_SMS_CONFIG.hasOwnProperty('CharsetURL')) ?
    MITAKE_SMS_CONFIG.SmSendApiUrl + '?CharsetURL='
    + MITAKE_SMS_CONFIG.CharsetURL : MITAKE_SMS_CONFIG.SmSendApiUrl;

/**
 * @type {object} 預設發送簡訊的資料
 * @property {string} username - 三竹簡訊帳號
 * @property {string} password - 三竹簡訊密碼
 * @property {string} [dlvtime] - 簡訊預約時間 (選填)
 * @property {string} [vldtime] - 簡訊有效期限 (選填)
 * @property {string} [response] - 狀態主動回報網址 (選填)
 * @property {string} [smsPointFlag] - 預設值為0，若值等於1時，回覆結果會加上smsPoint，該筆簡訊的扣除點數。 (選填)
 */
const DefaultSendBody = {
    username: MITAKE_SMS_CONFIG.username,
    password: MITAKE_SMS_CONFIG.password,
};

[
    'dlvtime',
    'vldtime',
    'response',
    'smsPointFlag'
].forEach((key) => {
    if (MITAKE_SMS_CONFIG[key]) {
        DefaultSendBody[key] = MITAKE_SMS_CONFIG[key];
    }
});


const STATUS_MESSAGES = {
    '*': '系統發生錯誤，請聯絡三竹資訊窗口人員',
    'a': '簡訊功能暫時停止服務，請稍候再試',
    'b': '簡訊功能暫時停止服務，請稍候再試',
    'c': '請輸入帳號',
    'd': '請輸入密碼',
    'e': '帳號、密碼錯誤',
    'f': '帳號已過期',
    'h': '帳號已被停用',
    'k': '無效的連線位址',
    'l': '帳號已達到同時連線數上限',
    'm': '必須變更密碼，在變更密碼前，無法使用簡訊發送服務',
    'n': '密碼已過期，請變更密碼，否則無法使用簡訊發送服務',
    'p': '沒有權限使用外部Http程式',
    'r': '系統暫停服務，請稍候再試',
    's': '帳務處理失敗，無法發送簡訊',
    't': '簡訊已過期',
    'u': '簡訊內容不得為空白',
    'v': '無效的手機號碼',
    'w': '查詢筆數超過上限',
    'x': '發送檔案過大，無法發送簡訊',
    'y': '參數錯誤',
    'z': '查無資料',
    '0': '預約傳送中',
    '1': '已送達業者',
    '2': '已送達業者',
    '3': '已送達手機',
    '4': '內容有錯誤',
    '5': '門號有錯誤',
    '6': '簡訊已停用',
    '7': '適時無法送達',
    '8': '預約已取消',
};

module.exports = {
    SmSendApiUrl,
    DefaultSendBody,
    STATUS_MESSAGES
};
