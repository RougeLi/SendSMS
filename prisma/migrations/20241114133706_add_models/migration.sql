-- CreateTable
CREATE TABLE "message_template" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "send_task" (
    "id" SERIAL NOT NULL,
    "jobDescribe" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "coupon" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    "isSent" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "send_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_template_description_key" ON "message_template"("description");

-- CreateIndex
CREATE UNIQUE INDEX "send_task_jobDescribe_mobile_coupon_key" ON "send_task"("jobDescribe", "mobile", "coupon");
