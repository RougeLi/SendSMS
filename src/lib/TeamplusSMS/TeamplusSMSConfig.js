const loadConfig = require('../config');

const CONFIG_FILE_NAME = 'teamplus-sms-config';

/**
 * @type {TeamplusSMSConfig}
 */
const TEAMPLUS_SMS_CONFIG = loadConfig(CONFIG_FILE_NAME);

// Check required keys
[
    'SiteUrl',
    'custcode',
    'uid',
    'pwd',
].forEach((key) => {
    if (!TEAMPLUS_SMS_CONFIG[key]) {
        throw new Error(`${CONFIG_FILE_NAME} file missing required key: ${key}`);
    }
});

/**
 * teamplus簡訊 API 基礎 URL
 * @type {string} BaseApiUrl
 */
const BaseApiUrl = `https://${TEAMPLUS_SMS_CONFIG.SiteUrl}/${TEAMPLUS_SMS_CONFIG.custcode}`;

/**
 * @type {object} 預設發送簡訊的資料
 * @property {string} uid - teamplus簡訊帳號
 * @property {string} pwd - teamplus簡訊密碼
 * @property {string} [retrytime] - 簡訊有效期限 (選填)
 */
const DefaultSendBody = {
    uid: TEAMPLUS_SMS_CONFIG.uid,
    pwd: TEAMPLUS_SMS_CONFIG.pwd,
};

// Add optional parameters if they exist in the config
[
    'retrytime',
].forEach((key) => {
    if (TEAMPLUS_SMS_CONFIG[key]) {
        DefaultSendBody[key] = TEAMPLUS_SMS_CONFIG[key];
    }
});

// API endpoints
const API_ENDPOINTS = {
    GET_TOKEN: `${BaseApiUrl}/getoken`,
    CHECK_TOKEN: `${BaseApiUrl}/tokenislive`,
    SEND_SMS: `${BaseApiUrl}/sendsms`,
    SEND_EXCLUSIVE_SMS: `${BaseApiUrl}/sendexclusive_sms`,
    SEND_PARAM_SMS: `${BaseApiUrl}/sendparam_sms`,
    GET_CREDIT: `${BaseApiUrl}/getcredit`,
    GET_DR_STATUS: `${BaseApiUrl}/getdrstatus`,
    GET_REPLY_MSG: `${BaseApiUrl}/getreplymsg`,
    CANCEL_BOOKING: `${BaseApiUrl}/cancelbooking`,
};

// Status messages
const STATUS_MESSAGES = {
    '200': 'success',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '500': 'Internal Server Error',
};

module.exports = {
    BaseApiUrl,
    DefaultSendBody,
    API_ENDPOINTS,
    STATUS_MESSAGES
};
