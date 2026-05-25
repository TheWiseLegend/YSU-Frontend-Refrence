import { Controller, Get, Param } from '@nestjs/common';
import { VerifyService } from './verify.service';

@Controller('verify')
export class VerifyController {
  constructor(private verifyService: VerifyService) {}

  @Get(':membershipId')
  verify(@Param('membershipId') membershipId: string) {
    return this.verifyService.verifyMembership(membershipId);
  }
}
