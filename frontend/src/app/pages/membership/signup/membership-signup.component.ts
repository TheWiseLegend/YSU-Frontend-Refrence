import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MemberAuthService } from '../../../services/member-auth.service';

@Component({
  selector: 'app-membership-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './membership-signup.component.html',
  styleUrls: ['./membership-signup.component.scss'],
})
export class MembershipSignupComponent {
  fullNameAr = '';
  fullNameEn = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private memberAuthService: MemberAuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    // Empty fields
    if (
      !this.fullNameAr ||
      !this.fullNameEn ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'يرجى ملء جميع الحقول';
      return;
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'صيغة البريد الإلكتروني غير صحيحة';
      return;
    }

    // Password strength: min 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessage =
        'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، ورقم';
      return;
    }

    // Password match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'كلمتا المرور غير متطابقتين';
      return;
    }

    // Name: only Arabic letters allowed in Arabic name field
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (!arabicRegex.test(this.fullNameAr.trim())) {
      this.errorMessage = 'الاسم بالعربية يجب أن يحتوي على حروف عربية فقط';
      return;
    }

    // Name: only English letters allowed in English name field
    const englishRegex = /^[a-zA-Z\s]+$/;
    if (!englishRegex.test(this.fullNameEn.trim())) {
      this.errorMessage =
        'الاسم بالإنجليزية يجب أن يحتوي على حروف إنجليزية فقط';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.memberAuthService
      .register({
        email: this.email,
        password: this.password,
        fullNameAr: this.fullNameAr,
        fullNameEn: this.fullNameEn,
      })
      .subscribe({
        next: () => this.router.navigate(['/membership/dashboard']),
        error: (err) => {
          this.errorMessage = err;
          this.isLoading = false;
        },
      });
  }
}
