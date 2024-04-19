import { Module, Global } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Global()
@Module({
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}