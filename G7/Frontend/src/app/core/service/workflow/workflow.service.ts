import { Injectable } from '@angular/core';
import {
  WfFormData,
  WfPlatformData,
  WfProcessError,
  WfProcessStep,
  WfVariable,
  WorkflowCockpit,
  workflowCockpit,
} from './workflow-cockpit';
import { WfUser } from './model/user';

type ErrorFunction = (
  proccessStep: WfProcessError,
  workflow: WorkflowCockpit
) => void;

type SubmitFunction = (
  proccessStep: WfProcessStep,
  workflow: WorkflowCockpit
) => WfFormData;

interface ProccessVariables {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private static readonly EMPTY_PLATFORM_DATA: WfPlatformData = {
    odataUrl: '',
    serviceUrl: '',
    token: undefined,
  };

  private workflow: WorkflowCockpit;
  private errorFunction: ErrorFunction;
  private submitFunction: SubmitFunction;

  constructor() {
    this.workflow = workflowCockpit({
      init: (_, workflow) => {
        this.workflow = workflow;
      },
      onSubmit: (processStep, workflow) => {
        this.workflow = workflow;
        if (this.submitFunction) {
          return this.submitFunction(processStep, workflow);
        }
        return {};
      },
      onError: (processError, workflow) => {
        this.workflow = workflow;
        if (this.errorFunction) {
          this.errorFunction(processError, workflow);
        }
      },
    });
  }

  public onError(fn: ErrorFunction): void {
    this.errorFunction = fn;
  }

  public onSubmit(fn: SubmitFunction): void {
    this.submitFunction = fn;
  }

  /**
   * @description aborta a ação de submit. Este método pode ser utilizado para cancelar a ação de subimit
   * caso o formulário seja inválido.
   */
  public abortSubmit(): void {
    throw new Error('Ação cancelada.');
  }

  public async requestPlatformDataAndVariables(): Promise<
    WfPlatformData & ProccessVariables
  > {
    const results = await Promise.all([
      this.requestPlatformData(),
      this.requestProcessVariables(),
    ]);
    const allPromiseResults = results.reduce(
      (previousValue, currentValue) =>
        Object.assign(previousValue, currentValue),
      {}
    );
    return allPromiseResults as WfPlatformData & ProccessVariables;
  }

  public async requestPlatformData(): Promise<WfPlatformData> {
    const platform = await this.workflow.getPlatformData();
    return platform || WorkflowService.EMPTY_PLATFORM_DATA;
  }

  public async requestUserData(): Promise<WfUser> {
    const data = await this.workflow.getUserData();
    if (data) {
      const userData: WfUser = Object.assign(new WfUser(), data);

      if (userData.username.indexOf('@') >= 0) {
        userData.username = userData.username.split('@')[0];
      }

      return userData;
    } else {
      return new WfUser();
    }
  }

  public async requestProcessVariables(): Promise<ProccessVariables> {
    const wfVariables = await this.workflow.getInfoFromProcessVariables();
    if (wfVariables) {
      return this.parsePendencyData(wfVariables);
    } else {
      return {};
    }
  }

  public getToken(bearer = true): string {
    const TOKEN = sessionStorage.getItem('senior-token');
    return bearer ? `Bearer ${TOKEN}` : TOKEN;
  }

  public getUser(): WfUser {
    return JSON.parse(sessionStorage.getItem('userData')) as WfUser;
  }

  private parsePendencyData(pendencyData: WfVariable[]): ProccessVariables {
    const data = {};
    for (const pendency of pendencyData) {
      const attr = pendency;
      if (
        attr.type === 'Integer' ||
        attr.type === 'Double' ||
        attr.type === 'Float'
      ) {
        data[attr.key] = parseFloat(attr.value);
      } else {
        data[attr.key] = attr.value;
      }
    }
    return data;
  }
}
