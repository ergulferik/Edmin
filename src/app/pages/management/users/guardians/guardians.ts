import { Component, Input, OnInit, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Address, Province } from '../../../../models/general.model';
import { HelperService } from '../../../../services/helper.service';
import { DynamicModalService } from '../../../../services/dynamic-modal.service';
import { AddressFormComponent } from '../address-form/address-form';
import { EmptyModal } from '../../../../components/modal/empty-modal/empty-modal';

/**
 * Guardians component
 * @description Veli & ebeveyn bilgileri için form component'i - modal veya düz component olarak kullanılabilir
 */
@Component({
 selector: 'app-guardians',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
 templateUrl: './guardians.html',
 styleUrl: './guardians.scss',
})
export class GuardiansComponent implements OnInit {
 private fb = inject(FormBuilder);
 private helperService = inject(HelperService);
 private dynamicModalService = inject(DynamicModalService);
 private dialog = inject(MatDialog);
 onValueChange = output<FormArray>();

 @Input() guardians: FormArray = this.fb.array([this.createGuardianGroup('father')]);
 @Input() studentAddress?: Address;

 provinces = signal<Province[]>([]);

 /** Guardian relation options */
 readonly guardianRelationOptions = [
  { label: 'Anne', value: 'mother' },
  { label: 'Baba', value: 'father' },
  { label: 'Diğer', value: 'other' },
 ];

 ngOnInit(): void {
  const modal = this.dynamicModalService.modalData;
  if (modal) {
   // Modal içindeyse modal'dan gelen veriyi kullan
   if (Array.isArray(modal)) {
    this.guardians = this.fb.array(modal.map((g: any) => this.createGuardianGroupFromData(g)));
   }
  }

  // Şehirleri yükle
  this.helperService.getProvinces().then(provinces => {
   this.provinces.set(provinces);
  });

  // Değişiklikleri emit et
  this.guardians.valueChanges.subscribe(_ => {
   this.onValueChange.emit(this.guardians);
  });
 }

 /**
  * Yeni veli form grubu oluşturur
  */
 createGuardianGroup(relation: 'mother' | 'father' | 'other' = 'other'): FormGroup {
  return this.fb.group({
   relation: [relation, [Validators.required]],
   name: ['', [Validators.required]],
   phone: ['', [Validators.required, Validators.pattern(/^(\+90|0)?[5][0-9]{9}$/)]],
   email: ['', [Validators.email]],
   address: this.fb.group({
    city: [''],
    district: [''],
    fullAddress: [''],
    postalCode: [''],
   }),
   addressOption: ['same'], // 'same' veya 'custom'
   addressDisplay: [''], // Dropdown'da gösterilecek metin
  });
 }

 /**
  * Veriden veli form grubu oluşturur
  */
 private createGuardianGroupFromData(data: any): FormGroup {
  const group = this.createGuardianGroup(data.relation || 'other');
  group.patchValue(data);
  return group;
 }

 /**
  * Veli ekler
  */
 addGuardian(relation: 'mother' | 'father' | 'other' = 'other'): void {
  this.guardians.push(this.createGuardianGroup(relation));
  if (this.studentAddress && this.guardians.length > 0) {
   const newGuardian = this.guardians.at(this.guardians.length - 1) as FormGroup;
   newGuardian.get('address')?.patchValue(this.studentAddress);
   newGuardian.get('addressDisplay')?.setValue('Öğrenci ile aynı');
  }
 }

 /**
  * Belirli indexteki veliyi kaldırır
  */
 removeGuardian(index: number): void {
  if (this.guardians.length > 1) {
   this.guardians.removeAt(index);
  }
 }

 /**
  * Yakınlık seçildiğinde
  */
 onSelectRelation(relation: string, index: number): void {
  this.guardians.at(index).get('relation')?.setValue(relation);
 }

 /**
  * Seçili yakınlığı döndürür
  */
 getSelectedRelation(index: number): string {
  const relation = this.guardians.at(index).get('relation')?.value;
  if (relation === 'mother') {
   return 'Anne';
  } else if (relation === 'father') {
   return 'Baba';
  } else if (relation === 'other') {
   return 'Diğer';
  } else {
   return 'Yakınlık seçiniz';
  }
 }

 /**
  * Veli adres seçeneği değiştiğinde
  */
 onGuardianAddressOptionChange(option: string, index: number): void {
  const guardianGroup = this.guardians.at(index) as FormGroup;
  guardianGroup.get('addressOption')?.setValue(option);

  if (option === 'same') {
   // Öğrenci adresini kopyala
   if (this.studentAddress) {
    guardianGroup.get('address')?.patchValue(this.studentAddress);
    guardianGroup.get('addressDisplay')?.setValue('Öğrenci ile aynı');
   }
  } else if (option === 'custom') {
   // Adres form popup'ını aç
   this.openAddressForm(index);
  }
 }

 /**
  * Adres form popup'ını açar
  */
 async openAddressForm(guardianIndex: number): Promise<void> {
  const guardianGroup = this.guardians.at(guardianIndex) as FormGroup;
  const currentAddress = guardianGroup.get('address')?.value;

  const dialogRef = this.dialog.open(EmptyModal, {
   width: '600px',
   maxWidth: '90vw',
   data: {
    title: 'Adres Bilgileri',
    subtitle: 'Adres bilgilerini girin',
    content: AddressFormComponent,
    contentData: currentAddress || {},
   },
  });

  const result = await dialogRef.afterClosed().toPromise();
  if (result === 'save') {
   const address = this.dynamicModalService.modalData as Address;
   if (address) {
    guardianGroup.get('address')?.patchValue(address);
    const displayText = await this.getAddressDisplayText(address);
    guardianGroup.get('addressDisplay')?.setValue(displayText);
   } else {
    // Popup iptal edildi, 'same' seçeneğine dön
    guardianGroup.get('addressOption')?.setValue('same');
    if (this.studentAddress) {
     guardianGroup.get('address')?.patchValue(this.studentAddress);
     guardianGroup.get('addressDisplay')?.setValue('Öğrenci ile aynı');
    }
   }
  } else {
   // Popup iptal edildi, 'same' seçeneğine dön
   guardianGroup.get('addressOption')?.setValue('same');
   if (this.studentAddress) {
    guardianGroup.get('address')?.patchValue(this.studentAddress);
    guardianGroup.get('addressDisplay')?.setValue('Öğrenci ile aynı');
   }
  }
  this.dynamicModalService.modalData = undefined;
 }

 /**
  * Adres görüntü metnini oluşturur (İlçe / İl formatında)
  */
 private async getAddressDisplayText(address: Address): Promise<string> {
  if (!address.city && !address.district) {
   return '';
  }

  const cityId = Number(address.city);
  const districtId = Number(address.district);

  const cityName = this.provinces().find(p => p.id === cityId)?.name || '';

  let districtName = '';
  if (districtId && cityId) {
   const districts = await this.helperService.getDistricts(cityId);
   districtName = districts.find(d => d.id === districtId)?.name || '';
  }

  if (districtName && cityName) {
   return `${districtName} / ${cityName}`;
  } else if (cityName) {
   return cityName;
  }
  return '';
 }

 /**
  * Veli adres dropdown metnini döndürür
  */
 getGuardianAddressDisplay(index: number): string {
  const guardianGroup = this.guardians.at(index) as FormGroup;
  const addressOption = guardianGroup.get('addressOption')?.value;
  const addressDisplay = guardianGroup.get('addressDisplay')?.value;

  if (addressOption === 'same') {
   return 'Öğrenci ile aynı';
  } else if (addressOption === 'custom' && addressDisplay) {
   return addressDisplay;
  }
  return 'Adres seçiniz';
 }
}
