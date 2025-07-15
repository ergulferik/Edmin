import { Component, Input } from '@angular/core';

/**
 * Avatar component for displaying user image or initials.
 */
@Component({
 selector: 'edmin-avatar',
 imports: [],
 templateUrl: './avatar.html',
 styleUrl: './avatar.scss',
})
/**
 * Displays a user avatar with image and fallback initials.
 */
export class Avatar {
 /** Avatar data: image URL and initials */
 @Input({
  required: true,
 })
 data: {
  image?: string;
  initials?: string;
 } = {
  image: '',
  initials: '?',
 };
 /** Avatar size (CSS size string) */
 @Input()
 size: string = '48px';
 /** Error state for image loading */
 isError = false;
}
