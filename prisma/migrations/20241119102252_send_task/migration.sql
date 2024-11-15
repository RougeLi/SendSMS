-- CreateEnum
CREATE TYPE "SentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "send_task" (
    "task_id" UUID NOT NULL,
    "task_topic" TEXT NOT NULL,
    "mobile" VARCHAR(15) NOT NULL,
    "coupon" TEXT NOT NULL,
    "message_id" INTEGER NOT NULL,
    "sent_status" "SentStatus" NOT NULL DEFAULT 'PENDING',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "send_task_pkey" PRIMARY KEY ("task_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "send_task_task_topic_mobile_coupon_key" ON "send_task"("task_topic", "mobile", "coupon");
