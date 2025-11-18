import { Injectable } from '@angular/core';

/**
 * Dynamic modal service
 * @description Dynamic modal service for managing modal data
 */
@Injectable({
 providedIn: 'root',
})
/**
 * Dynamic modal service
 * @description Dynamic modal service for managing modal data
 */
export class DynamicModalService {
 private _modalData: any;

 constructor() {}

 set modalData(data: any) {
  this._modalData = data;
 }

 get modalData(): any {
  return this._modalData;
 }
}
