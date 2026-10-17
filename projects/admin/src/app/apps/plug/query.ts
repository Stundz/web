import type { PageEvent } from '@angular/material/paginator';
import type { ParamMap, Params } from '@angular/router';

export function listQuery(map: ParamMap, keys: readonly string[]): Record<string, string> {
  const params: Record<string, string> = {};
  for (const key of keys) {
    const value = map.get(key)?.trim();
    if (value) params[key] = value;
  }
  return params;
}

export function pageChange(event: PageEvent, perPage: number): Params {
  const queryParams: Params = { page: event.pageIndex + 1 };
  if (perPage !== event.pageSize) queryParams['limit'] = event.pageSize;
  return queryParams;
}
