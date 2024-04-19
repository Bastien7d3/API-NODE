import { UseGuards, Post, Get, Param, Controller, Request, HttpException, HttpStatus } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerGuard } from './worker.guard';

@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) { }

  @Post()
  create(): string {
    return 'This action adds a new worker';
  }

  @Get()
  @UseGuards(WorkerGuard)
  async findAll(@Request() req): Promise<any[]> {
    const workers = await this.workerService.findAll();
    return workers.map(worker => this.filterWorkerData(worker, req.user.scope));
  }

  @Get(':id')
  @UseGuards(WorkerGuard)
  async findOne(@Param('id') id: string, @Request() req): Promise<any> {
    const worker = await this.workerService.findOne(id);
    if (!worker) {
      throw new HttpException('L\'id n\'existe pas', HttpStatus.NOT_FOUND);
    }
    return this.filterWorkerData(worker, req.user.scope);
  }

  private filterWorkerData(worker: any, scope: string): any {
    switch (scope) {
      case 'salaire':
        return this.filterSalaryData(worker);
      case 'identité':
        return this.filterIdentityData(worker);
      default:
        return this.filterBasicData(worker);
    }
  }

  private filterBasicData(worker: any): any {
    return {
      employee_id: worker.employee_id,
      first_name: worker.first_name,
      last_name: worker.last_name
    };
  }

  private filterSalaryData(worker: any): any {
    return {
      ...this.filterBasicData(worker),
      monthly_salary: worker.monthly_salary,
    };
  }

  private filterIdentityData(worker: any): any {
    return {
      ...this.filterBasicData(worker),
      nationality: worker.nationality,
      national_id_number: worker.national_id_number,
    };
  }
}
