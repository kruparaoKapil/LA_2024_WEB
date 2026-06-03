import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface AppSettings {
  ApiHostUrl: string;
  ApiReportUrl: string;
}

/**
 * Loads {@link AppSettings} from `assets/appsettings.json` once at startup
 * and exposes the resolved hosts as readonly signals.
 *
 * Replaces the legacy 2-trip dance in `common.service.ts` where every
 * `callGetAPI` re-fetched `environment.apiURL` before issuing the real call.
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);

  private readonly settings = signal<AppSettings | null>(null);
  readonly apiHost = signal<string>('');
  readonly reportHost = signal<string>('');
  readonly ready = signal<boolean>(false);

  async load(): Promise<void> {
    const list = await firstValueFrom(this.http.get<AppSettings[]>(environment.appSettingsUrl));
    const cfg = list?.[0];
    if (!cfg?.ApiHostUrl) {
      throw new Error('appsettings.json is missing or has no ApiHostUrl');
    }
    this.settings.set(cfg);
    this.apiHost.set(cfg.ApiHostUrl.replace(/\/+$/, ''));
    this.reportHost.set((cfg.ApiReportUrl ?? '').replace(/\/+$/, ''));
    this.ready.set(true);
  }
}
