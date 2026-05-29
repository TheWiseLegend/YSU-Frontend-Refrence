-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "resetPasswordCode" VARCHAR(6),
ADD COLUMN     "resetPasswordExpiresAt" TIMESTAMP(3);
