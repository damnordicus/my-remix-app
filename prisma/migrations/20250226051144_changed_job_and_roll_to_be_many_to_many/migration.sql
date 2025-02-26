-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_rollId_fkey";

-- CreateTable
CREATE TABLE "_JobToRoll" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobToRoll_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JobToRoll_B_index" ON "_JobToRoll"("B");

-- AddForeignKey
ALTER TABLE "_JobToRoll" ADD CONSTRAINT "_JobToRoll_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToRoll" ADD CONSTRAINT "_JobToRoll_B_fkey" FOREIGN KEY ("B") REFERENCES "Roll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
