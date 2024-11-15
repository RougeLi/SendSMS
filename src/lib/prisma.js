const {PrismaClient, SentStatus} = require('./prisma-client');
const {
    PENDING,
    IN_PROGRESS,
    SUCCESS,
    FAILED
} = SentStatus;

module.exports = {
    prisma: new PrismaClient(),
    SENT_STATUS_PENDING: PENDING,
    SENT_STATUS_IN_PROGRESS: IN_PROGRESS,
    SENT_STATUS_SUCCESS: SUCCESS,
    SENT_STATUS_FAILED: FAILED
};
