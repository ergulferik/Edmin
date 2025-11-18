import { Component, Input, OnInit, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Province, District, Address } from '../../../../models/general.model';
import { HelperService } from '../../../../services/helper.service';
import { DynamicModalService } from '../../../../services/dynamic-modal.service';

/**
 * Address form component
 * @description Adres bilgileri için popup form component'i
 */
@Component({
 selector: 'app-address-form',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
 templateUrl: './address-form.html',
 styleUrl: './address-form.scss',
})
export class AddressFormComponent implements OnInit {
 private fb = inject(FormBuilder);
 private helperService = inject(HelperService);
 private dynamicModalService = inject(DynamicModalService);
 onValueChange = output<Address>();
 @Input() address?: Address;

 provinces = signal<Province[]>([]);
 districts = signal<District[]>([]);

 // Dropdown state management
 selectedCityName = signal<string>('Şehir seçiniz');
 selectedDistrictName = signal<string>('İlçe seçiniz');

 /**
  * Address form group
  */
 addressForm: FormGroup = this.fb.group({
  city: [''],
  district: [''],
  fullAddress: [''],
  postalCode: [''],
 });

 ngOnInit(): void {
  const modal = this.dynamicModalService.modalData;

  if (modal) {
   // Modal içindeyse modal'dan gelen veriyi kullan
   this.addressForm.patchValue(modal);
   this.addressForm.valueChanges.subscribe(_ => {
    this.dynamicModalService.modalData = this.addressForm.value as Address;
   });
  } else {
   // Düz component olarak kullanılıyorsa output ile emit et
   this.addressForm.valueChanges.subscribe(value => {
    this.onValueChange.emit(value as Address);
   });
  }

  // Şehirleri yükle
  this.helperService.getProvinces().then(provinces => {
   this.provinces.set(provinces);

   // İlk veriyi yükle
   const initialData = modal || this.address;
   if (initialData) {
    this.updateFormFromAddress(initialData);
   }
  });
 }

 /**
  * Adres verisinden form'u günceller
  */
 private updateFormFromAddress(address: Address): void {
  this.addressForm.patchValue(address, { emitEvent: false });

  if (address.city) {
   const cityId = Number(address.city);
   const cityName = this.provinces().find(p => p.id === cityId)?.name;
   if (cityName) {
    this.selectedCityName.set(cityName);
    this.helperService.getDistricts(cityId).then(districts => {
     this.districts.set(districts);
     if (address.district) {
      const districtId = Number(address.district);
      const districtName = districts.find(d => d.id === districtId)?.name;
      if (districtName) {
       this.selectedDistrictName.set(districtName);
      }
     }
    });
   }
  }

  // Input'tan gelen güncellemeleri emit etme (sonsuz döngüyü önlemek için)
  // Sadece kullanıcı değişikliklerini emit ediyoruz
 }

 /**
  * Şehir seçildiğinde
  */
 onSelectCity(provinceId: number, provinceName: string): void {
  this.addressForm.get('city')?.setValue(provinceId);
  this.selectedCityName.set(provinceName);
  this.helperService.getDistricts(provinceId).then(districts => {
   this.districts.set(districts);
   if (this.addressForm.get('district')?.value) {
    this.onSelectDistrict(
     this.addressForm.get('district')?.value,
     this.getSelectedDistrictById(this.addressForm.get('district')?.value)
    );
   } else {
    this.addressForm.get('district')?.setValue('');
    this.selectedDistrictName.set('İlçe seçiniz');
   }
  });
 }

 getSelectedCityById(id: number): string {
  return this.provinces().find(province => province.id === id)?.name ?? 'Şehir seçiniz';
 }

 getSelectedDistrictById(id: number): string {
  return this.districts().find(district => district.id === id)?.name ?? 'İlçe seçiniz';
 }

 /**
  * İlçe seçildiğinde
  */
 onSelectDistrict(districtId: number, districtName: string): void {
  this.addressForm.get('district')?.setValue(districtId);
  this.selectedDistrictName.set(districtName);
 }
}
