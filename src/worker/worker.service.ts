import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

export interface Worker {
  employee_id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  department_id: number;
  national_id_number: string;
  bank_account_number: string;
  monthly_salary: number;
  job_title: string;
  contract_start_date: string;
  contract_end_date: string | null;
}

@Injectable()
export class WorkerService {
  private workers: Worker[];

  constructor() {
    this.workers = this.readWorkersFromFile();
  }

  findAll(): Worker[] {
    return this.workers;
  }

  findOne(id: string): Worker | undefined {
    return this.workers.find(worker => worker.employee_id === id);
  }

  private readWorkersFromFile(): Worker[] {
    try {
      const rawContent = fs.readFileSync('worker.json');
      return JSON.parse(rawContent.toString());
    } catch (error) {
      console.error(`Erreur lors de la lecture du fichier worker.json : ${error}`);
      return [];
    }
  }
}
