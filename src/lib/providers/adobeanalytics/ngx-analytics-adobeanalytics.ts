import * as path from 'path';

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare const s: any;

@Injectable()
export class NgxAnalyticsAdobeAnalytics {

  constructor(
    private ngxAnalytics: NgxAnalytics,
    private location: Location,
  ) {
    this.ngxAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.ngxAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.ngxAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string) {
    if (typeof s !== 'undefined' && s) {
      s.clearVars();
      s.t({pageName: path});
    }
  }

  /**
   * Track Event in Adobe Analytics
   *
   * @param action associated with the event
   * @param properties action detials
   * @param {string} properties.category
   * @param {string} [properties.label]
   * @param {number} [properties.value]
   * @param {boolean} [properties.noninteraction]
   *
   * @link https://marketing.adobe.com/resources/help/en_US/sc/implement/js_implementation.html
   */
  eventTrack(action: string, properties: any) {
    if (!properties) {
      properties = properties || {};
    }

    if (typeof s !== 'undefined' && s) {
      if (typeof properties === 'object') {
        this.setUserProperties(properties);
      }
      if (action) {
        // if linkName property is passed, use that; otherwise, the action is the linkName
        const linkName = (properties['linkName']) ? properties['linkName'] : action;
        // note that 'this' should refer the link element, but we can't get that in this function. example:
        // <a href="http://anothersite.com" onclick="s.tl(this,'e','AnotherSite',null)">
        // if disableDelay property is passed, use that to turn off/on the 500ms delay; otherwise, it uses this
        const disableDelay = !!properties['disableDelay'] ? true : this;
        // if action property is passed, use that; otherwise, the action remains unchanged
        if (properties['action']) {
          action = properties['action'];
        }
        this.setPageName();

        if (action.toUpperCase() === 'DOWNLOAD') {
          s.tl(disableDelay, 'd', linkName);
        } else if (action.toUpperCase() === 'EXIT') {
          s.tl(disableDelay, 'e', linkName);
        } else {
          s.tl(disableDelay, 'o', linkName);
        }
      }
    }
  }

  private setPageName() {
    const path = this.location.path(true);
    const hashNdx = path.indexOf('#');
    if (hashNdx > 0 && hashNdx < path.length) {
      s.pageName = path.substring(hashNdx + 1);
    } else {
      s.pageName = path;
    }
  }

  setUserProperties(properties: any) {
    if (typeof s !== 'undefined' && s) {
      if (typeof properties === 'object') {
        for (const key in properties) {
          if (properties.hasOwnProperty(key)) {
            s[key] = properties[key];
          }
        }
      }
    }
  }

}
