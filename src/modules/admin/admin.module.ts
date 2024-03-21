import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { Service } from './services/activities.service';

@Module({
  providers: [AdminService, Service]
})
export class AdminModule {}


