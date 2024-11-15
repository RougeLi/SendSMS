const createMessageTemplate = require("./lib/createMessageTemplate");

async function main() {
    const newDescription = process.env.NEW_DESCRIPTION;
    if (!newDescription) {
        console.error('缺少 NEW_DESCRIPTION 環境變數');
        return;
    }
    await createMessageTemplate(newDescription);
}

main().catch(e => console.error(e));
