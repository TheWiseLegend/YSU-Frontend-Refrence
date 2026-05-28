import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { LucideDynamicIcon, provideLucideIcons, LucideIcon } from '@lucide/angular';
import { VendorService } from '../../../services/vendor.service';
import { MemberAuthService } from '../../../services/member-auth.service';
import { MembershipService } from '../../../services/membership.service';
import { PublicVendor } from '../../../models/vendor.model';
import { Member } from '../../../models/member.model';
import { ALL_VENDOR_LUCIDE_ICONS, getVendorIcon } from '../../../data/vendor-icons';

@Component({
  selector: 'app-membership-vendor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideDynamicIcon],
  providers: [provideLucideIcons(...ALL_VENDOR_LUCIDE_ICONS)],
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss'],
})
export class MembershipVendorDetailComponent implements OnInit {
  vendor: PublicVendor | undefined;
  member: Member | null = null;
  isLoading = true;
  notFound = false;
  showSettings = false;

  // ─── Slider ──────────────────────────────────────────────────────────────────
  activeSlide = 0;
  private touchStartX = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private vendorService: VendorService,
    private memberAuthService: MemberAuthService,
    private membershipService: MembershipService,
  ) {}

  ngOnInit(): void {
    this.membershipService.getMe().subscribe({
      next: (member) => (this.member = member),
      error: () => {
        this.memberAuthService.logout();
        this.router.navigate(['/membership/login']);
      },
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.loadVendor(id);
    });
  }

  private loadVendor(id: string): void {
    this.isLoading = true;
    this.vendorService.getVendorById(id).subscribe({
      next: (vendor) => {
        this.vendor = vendor;
        this.notFound = false;
        this.isLoading = false;
        this.activeSlide = 0;
        document.title = `${vendor.name} - اتحاد الطلبة اليمنيين في ماليزيا`;
      },
      error: () => {
        this.vendor = undefined;
        this.notFound = true;
        this.isLoading = false;
      },
    });
  }

  // ─── Slider helpers ───────────────────────────────────────────────────────────

  get sliderImages(): string[] {
    if (!this.vendor) return [];
    const gallery = (this.vendor.images ?? []).map(i => i.url);
    // If no gallery images, fall back to the main logo
    return gallery.length > 0 ? gallery : (this.vendor.imageUrl ? [this.vendor.imageUrl] : []);
  }

  prevSlide(): void {
    const len = this.sliderImages.length;
    this.activeSlide = (this.activeSlide - 1 + len) % len;
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.sliderImages.length;
  }

  goToSlide(index: number): void {
    this.activeSlide = index;
  }

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    const delta = this.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? this.nextSlide() : this.prevSlide();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (this.vendor && this.sliderImages.length > 1) {
      if (e.key === 'ArrowLeft') this.nextSlide();
      if (e.key === 'ArrowRight') this.prevSlide();
    }
  }

  // ─── Other helpers ────────────────────────────────────────────────────────────

  get memberInitials(): string {
    const parts = (this.member?.fullNameAr ?? '').trim().split(' ');
    return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0]?.slice(0, 2) ?? '';
  }

  getCategoryIcon(key: string | null | undefined): LucideIcon {
    return getVendorIcon(key);
  }

  openMaps(): void {
    if (this.vendor?.mapsUrl) window.open(this.vendor.mapsUrl, '_blank');
  }

  goBack(): void {
    this.location.back();
  }

  toggleSettings(event: Event): void {
    event.stopPropagation();
    this.showSettings = !this.showSettings;
  }

  @HostListener('document:click')
  closeSettings(): void {
    this.showSettings = false;
  }

  logout(): void {
    this.memberAuthService.logout();
    this.router.navigate(['/membership/login']);
  }

  formatExpiryDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ar-MY', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}
