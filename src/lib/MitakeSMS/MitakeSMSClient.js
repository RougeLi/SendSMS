const axios = require('axios');
const {
    SmSendApiUrl,
    DefaultSendBody
} = require('./MitakeSMSConfig');
const {stringify} = require("qs");

const method = 'POST';
const url = SmSendApiUrl;
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
};

/**
 * 發送簡訊
 * @param {TargetSendTaskData} targetSendTaskData - 發送任務資料
 * @param {string} message - 簡訊內容
 * @returns {Promise<MitakeResponse|MitakeErrorResponse>} - 傳送簡訊後的回應
 */
async function sendSms(targetSendTaskData, message) {
    const data = parseMitakeRequest(targetSendTaskData, message);
    const config = {
        method,
        url,
        headers,
        data
    };
    const response = await axios.request(config);
    return parseResponse(response);
}

function parseMitakeRequest(targetSendTaskData, message) {
    const {taskId, mobile} = targetSendTaskData;
    const data = {
        ...DefaultSendBody,
        clientid: taskId,
        dstaddr: mobile,
        smbody: message,
    };
    return stringify(data);
}

/**
 * 解析三竹簡訊 API 回應
 * @param {object} response - Axios 回應物件
 * @returns {MitakeResponse|MitakeErrorResponse} - 解析後的回應物件
 */
function parseResponse(response) {
    const {data} = response;
    if (data === undefined) {
        return {
            clientId: '未提供',
            statusCode: '未知',
            error: '未知錯誤'
        };
    }

    const mitakeResult = parseMitakeResult(data);
    if (mitakeResult.hasOwnProperty('Error')) {
        return {
            clientId: mitakeResult.clientId,
            statusCode: mitakeResult['statuscode'],
            error: mitakeResult['Error']
        };
    }

    const mitakeResponse = {
        clientId: mitakeResult.clientId,
        msgId: mitakeResult['msgid'],
        statusCode: mitakeResult['statuscode'],
        accountPoint: parseInt(mitakeResult['AccountPoint'], 10),
    };
    if (mitakeResult.hasOwnProperty('Duplicate')) {
        mitakeResponse.duplicate = mitakeResult['Duplicate'];
    }
    if (mitakeResult.hasOwnProperty('smsPoint')) {
        mitakeResponse.smsPoint = parseInt(mitakeResult['smsPoint'], 10);
    }
    return mitakeResponse;
}

function parseMitakeResult(data) {
    const lines = data.trim().split('\n');
    const result = {};
    lines.forEach((line, index) => {
        line = line.trim();
        if (index === 0) {
            const clientIdMatch = line.match(/^\[(.*)]$/);
            if (clientIdMatch) {
                result.clientId = clientIdMatch[1];
            }
            return;
        }
        const [key, value] = line.split('=');
        if (key && value !== undefined) {
            result[key] = value;
        }
    });
    return result;
}

module.exports = sendSms;
