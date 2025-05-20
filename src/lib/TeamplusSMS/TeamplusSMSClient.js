const axios = require('axios');
const {
    API_ENDPOINTS,
    DefaultSendBody
} = require('./TeamplusSMSConfig');

/**
 * 發送一般簡訊
 * @param {TargetSendTaskData} targetSendTaskData - 發送任務資料
 * @param {string} message - 簡訊內容
 * @returns {Promise<TeamplusResponse|TeamplusErrorResponse>} - 傳送簡訊後的回應
 */
async function sendSms(targetSendTaskData, message) {
    const { taskId, mobile } = targetSendTaskData;

    const data = {
        ...DefaultSendBody,
        subject: targetSendTaskData.taskTopic || '簡訊通知',
        msg: message,
        mobiles: mobile,
        sendtime: ''
    };

    const config = {
        method: 'POST',
        url: API_ENDPOINTS.SEND_SMS,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        return parseResponse(response, taskId);
    } catch (error) {
        return parseErrorResponse(error, taskId);
    }
}

/**
 * 發送專屬簡訊
 * @param {TargetSendTaskData} targetSendTaskData - 發送任務資料
 * @param {string} message - 簡訊內容
 * @param {string} token - 連線憑證
 * @returns {Promise<TeamplusResponse|TeamplusErrorResponse>} - 傳送簡訊後的回應
 */
async function sendExclusiveSms(targetSendTaskData, message, token) {
    const { taskId, mobile } = targetSendTaskData;

    const data = {
        uid: DefaultSendBody.uid,
        token: token,
        subject: targetSendTaskData.taskTopic || '簡訊通知',
        retrytime: DefaultSendBody.retrytime || '1440',
        recipientdatalist: [
            {
                mobile: mobile,
                sendtime: '',
                params: '',
                mr: ''
            }
        ]
    };

    const config = {
        method: 'POST',
        url: API_ENDPOINTS.SEND_EXCLUSIVE_SMS,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        return parseResponse(response, taskId);
    } catch (error) {
        return parseErrorResponse(error, taskId);
    }
}

/**
 * 發送參數簡訊
 * @param {TargetSendTaskData} targetSendTaskData - 發送任務資料
 * @param {string} paramsContent - 參數化簡訊內容
 * @param {string} params - 參數值，以逗號分隔
 * @param {string} token - 連線憑證
 * @returns {Promise<TeamplusResponse|TeamplusErrorResponse>} - 傳送簡訊後的回應
 */
async function sendParamSms(targetSendTaskData, paramsContent, params, token) {
    const { taskId, mobile } = targetSendTaskData;

    const data = {
        uid: DefaultSendBody.uid,
        token: token,
        subject: targetSendTaskData.taskTopic || '簡訊通知',
        paramsContent: paramsContent,
        recipientdatalist: [
            {
                mobile: mobile,
                sendtime: '',
                params: params,
                mr: ''
            }
        ]
    };

    const config = {
        method: 'POST',
        url: API_ENDPOINTS.SEND_PARAM_SMS,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        return parseResponse(response, taskId);
    } catch (error) {
        return parseErrorResponse(error, taskId);
    }
}

/**
 * 取得連線憑證
 * @returns {Promise<string|null>} - 連線憑證
 */
async function getToken() {
    const data = {
        uid: DefaultSendBody.uid,
        pwd: DefaultSendBody.pwd
    };

    const config = {
        method: 'POST',
        url: API_ENDPOINTS.GET_TOKEN,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        if (response.data && response.data.status === '200' && response.data.data && response.data.data.token) {
            return response.data.data.token;
        }
        return null;
    } catch (error) {
        console.error('取得連線憑證失敗:', error.message);
        return null;
    }
}

/**
 * 檢查連線狀態
 * @param {string} token - 連線憑證
 * @returns {Promise<boolean>} - 連線是否有效
 */
async function checkTokenIsLive(token) {
    const data = {
        uid: DefaultSendBody.uid,
        token: token
    };

    const config = {
        method: 'POST',
        url: API_ENDPOINTS.CHECK_TOKEN,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        return response.data &&
               response.data.status === '200' &&
               response.data.data &&
               response.data.data.tokenislive === '1';
    } catch (error) {
        console.error('檢查連線狀態失敗:', error.message);
        return false;
    }
}

/**
 * 解析teamplus簡訊 API 回應
 * @param {object} response - Axios 回應物件
 * @param {string} clientId - 客戶端 ID，即為task_id
 * @returns {TeamplusResponse} - 解析後的回應物件
 */
function parseResponse(response, clientId) {
    const { data } = response;

    if (!data || !data.status) {
        return {
            clientId: clientId,
            status: '500',
            message: '未知錯誤'
        };
    }

    // 成功回應
    if (data.status === '200' && data.data) {
        return {
            clientId: clientId,
            status: data.status,
            message: data.message,
            batchid: data.data.batchid || '',
            credit: data.data.credit || '0',
            sendcnt: data.data.sendcnt || '0',
            reducepoint: data.data.reducepoint || '0',
            unsendcnt: data.data.unsendcnt || '0'
        };
    }

    // 錯誤回應
    return {
        clientId: clientId,
        status: data.status,
        message: data.message || '未知錯誤'
    };
}

/**
 * 解析teamplus簡訊 API 錯誤回應
 * @param {object} error - Axios 錯誤物件
 * @param {string} clientId - 客戶端 ID，即為task_id
 * @returns {TeamplusErrorResponse} - 解析後的錯誤回應物件
 */
function parseErrorResponse(error, clientId) {
    let status = '500';
    let message = '未知錯誤';

    if (error.response && error.response.data) {
        status = error.response.data.status || status;
        message = error.response.data.message || error.message || message;
    } else if (error.message) {
        message = error.message;
    }

    return {
        clientId: clientId,
        status: status,
        message: message
    };
}

module.exports = {
    sendSms,
    sendExclusiveSms,
    sendParamSms,
    getToken,
    checkTokenIsLive
};
