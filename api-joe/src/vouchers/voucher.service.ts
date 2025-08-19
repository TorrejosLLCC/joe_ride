import { Injectable } from '@nestjs/common';

// Placeholder voucher calculation service
@Injectable()
export class VoucherService {
  private matrix = [10, 20, 30];

  calculate(rideType: 'offer' | 'request', participants: number) {
    const base = rideType === 'offer' ? 20 : 10;
    const bonus = participants > 2 ? 10 : 0;
    return base + bonus;
  }
}
