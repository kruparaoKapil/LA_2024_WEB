import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfigService } from '../config/app-config.service';

export type ParamsLike = HttpParams | Record<string, string | number | boolean | null | undefined> | string | undefined | null;

/**
 * Replacement for the legacy `CommonService.callGetAPI` / `callPostAPI` /
 * `callPostAPIMultipleParameters`.
 *
 * - `host` is read once from {@link AppConfigService} (set during APP_INITIALIZER).
 * - All methods preserve the original URL path strings, so server contracts
 *   are unchanged.
 * - Error handling is delegated to the global functional `errorInterceptor`.
 */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  // ---------- low-level URL building ----------
  private url(path: string, useReportHost = false): string {
    const host = useReportHost ? this.config.reportHost() : this.config.apiHost();
    if (!host) {
      throw new Error('AppConfigService not initialized — call AppConfigService.load() before any API call.');
    }
    return host + (path.startsWith('/') ? path : '/' + path);
  }

  private toParams(params: ParamsLike): HttpParams | undefined {
    if (params == null || params === '' || params === ' ') return undefined;
    if (params instanceof HttpParams) return params;
    if (typeof params === 'string') return undefined;
    let hp = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined) hp = hp.set(k, String(v));
    }
    return hp;
  }

  // ---------- public API ----------
  get<T = unknown>(path: string, params?: ParamsLike): Observable<T> {
    const httpParams = this.toParams(params);
    return this.http.get<T>(this.url(path), httpParams ? { params: httpParams } : {});
  }

  post<T = unknown, B = unknown>(path: string, body: B): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  put<T = unknown, B = unknown>(path: string, body: B): Observable<T> {
    return this.http.put<T>(this.url(path), body);
  }

  delete<T = unknown>(path: string, params?: ParamsLike): Observable<T> {
    const httpParams = this.toParams(params);
    return this.http.delete<T>(this.url(path), httpParams ? { params: httpParams } : {});
  }

  getReport<T = unknown>(path: string, params?: ParamsLike): Observable<T> {
    const httpParams = this.toParams(params);
    return this.http.get<T>(this.url(path, true), httpParams ? { params: httpParams } : {});
  }

  // ---------- legacy compatibility shims ----------
  /**
   * Mirrors `CommonService.callGetAPI(apiPath, params, parameterStatus)`.
   * `parameterStatus === 'YES'` previously meant "params is a HttpParams";
   * we now ignore the flag and accept any param shape.
   */
  callGetAPI<T = unknown>(apiPath: string, params: ParamsLike, _parameterStatus?: string): Observable<T> {
    return this.get<T>(apiPath, params);
  }

  callPostAPI<T = unknown, B = unknown>(apiPath: string, data: B): Observable<T> {
    return this.post<T, B>(apiPath, data);
  }
}
