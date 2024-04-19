import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class WorkerGuard implements CanActivate {
  private allowedEmployeeIds = ["W45455", "W45456", "W45457"];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);
    const response = await this.getIntrospectionResponse(token);

    if (!this.isEmployeeIdAllowed(response.data.data.employee_id)) {
      throw new ForbiddenException('Vous n\'avez pas les autorisations nécessaires pour accéder à cette ressource');
    }

    request.user = { employee_id: response.data.data.employee_id, scope: response.data.data.scope };
    return true;
  }

  private getTokenFromHeader(request: any): string {
    const bearerToken = request.headers.authorization;
    return bearerToken.replace("Bearer ", "");
  }

  private async getIntrospectionResponse(token: string): Promise<AxiosResponse> {
    return axios.get('http://localhost:4500/introspect', {
      params: { token },
    });
  }

  private isEmployeeIdAllowed(employeeId: string): boolean {
    return this.allowedEmployeeIds.includes(employeeId);
  }
}
