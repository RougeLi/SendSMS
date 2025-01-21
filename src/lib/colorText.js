// ANSI 顏色代碼常量
const RESET = "\x1b[0m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

// 顏色常量定義
const COLORS = {
    reset: RESET,
    red: FgRed,
    green: FgGreen,
    yellow: FgYellow,
    blue: FgBlue,
    magenta: FgMagenta,
    cyan: FgCyan,
    white: FgWhite,
};

// 功能函數：為訊息添加顏色
function colorText(text, color) {
    return `${COLORS[color] || COLORS.reset}${text}${COLORS.reset}`;
}

module.exports = colorText;
