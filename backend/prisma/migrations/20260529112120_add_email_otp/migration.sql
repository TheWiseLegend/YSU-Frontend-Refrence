-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpCode" VARCHAR(6),
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3);
