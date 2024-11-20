-- CreateTable
CREATE TABLE "mitake_response_log" (
    "sn" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "msg_id" VARCHAR(20),
    "status_code" VARCHAR(2) NOT NULL,
    "account_point" INTEGER,
    "duplicate" VARCHAR(2),
    "sms_point" INTEGER,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mitake_response_log_pkey" PRIMARY KEY ("sn")
);
