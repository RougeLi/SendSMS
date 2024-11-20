const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG_DIRECTORY = path.join(__dirname, '..', '..', 'config');
const YAML = '.yaml';
const YML = '.yml';
const JSON = '.json';
const SUPPORTED_EXTENSIONS = [YAML, YML, JSON];

/**
 * 配置緩存
 * @type {Map<string, Object>}
 */
const ConfigCache = new Map();

/**
 * 讀取並解析指定的 YAML 配置文件
 * @param {string} fileName - 配置文件名稱（不包含副檔名）
 * @returns {any} - 解析後的配置對象
 * @throws {Error} - 當讀取或解析失敗時拋出錯誤
 */
function loadConfig(fileName) {
    if (typeof fileName !== 'string') {
        throw new TypeError('fileName 必須是一個字符串');
    }
    if (ConfigCache.has(fileName)) {
        return ConfigCache.get(fileName);
    }

    try {
        const configData = getConfigData(
            getConfigPathWithExtension(fileName)
        );
        ConfigCache.set(fileName, configData);
        return configData;
    } catch (e) {
        console.error(`讀取配置文件 "${fileName}.yaml" 失敗:`, e.message);
        throw e;
    }
}

function getConfigPathWithExtension(fileName) {
    let configPath = null;
    let ext = null;
    for (const extension of SUPPORTED_EXTENSIONS) {
        const potentialPath = path.join(CONFIG_DIRECTORY, `${fileName}${extension}`);
        if (fs.existsSync(potentialPath)) {
            configPath = potentialPath;
            ext = extension;
            break;
        }
    }
    if (!configPath) {
        throw new Error(`配置文件不存在: ${fileName} (支持的格式: ${SUPPORTED_EXTENSIONS.join(', ')})`);
    }
    return {configPath, ext};
}

function getConfigData({configPath, ext}) {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    switch (ext) {
        case YAML:
        case YML:
            return yaml.load(fileContents);
        case JSON:
            return JSON.parse(fileContents);
        default:
            throw new Error(`不支持的配置文件格式: ${ext}`);
    }
}

module.exports = loadConfig;
