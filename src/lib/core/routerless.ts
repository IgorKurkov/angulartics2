
import { BehaviorSubject, Observable } from 'rxjs';

import { NgxAnalyticsSettings } from './ngx-analytics-config';

export interface TrackNavigationEnd {
  url: string;
}

export class RouterlessTracking {
  trackLocation(settings: NgxAnalyticsSettings): Observable<TrackNavigationEnd> {
    return new BehaviorSubject<TrackNavigationEnd>({ url: '/' });
  }
  prepareExternalUrl(url: string): string {
    return url;
  }
}
