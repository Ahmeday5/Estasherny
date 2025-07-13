import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; // جلب أداة النماذج
import { CommonModule } from '@angular/common'; // جلب أدوات مشتركة
import { FormsModule } from '@angular/forms'; // جلب أدوات النماذج
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // جلب دعم النماذج
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email: string = ''; // متغير لتخزين الإيميل
  password: string = ''; // متغير لتخزين كلمة المرور
  rememberMe: boolean = false;
  showPassword: boolean = false;

  constructor(
    private router: Router, // حقن Router عشان نتحكم في التنقل
    private authService: AuthService, // حقن AuthService عشان نعدل حالة تسجيل الدخول
    private apiService: ApiService // حقن ApiService عشان نتواصل مع الـ API
  ) {}

  // إضافة ngOnInit
  ngOnInit(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // دالة لمعالجة تسجيل الدخول
  onSubmit(form: NgForm): void {
    // form: NgForm بياخد النموذج من HTML ويخلينا نتحقق من صحته
    if (form.valid) {
      // التحقق إذا كان النموذج مكتمل وصحيح (زي required)
      const credentials = {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
      };
      // بنحضر كائن يحتوي على البريد وكلمة المرور من المتغيرات
      // ده اللي هيترسل للـ API عشان يتحقق منه.

      this.apiService.login(credentials).subscribe(
        // استدعاء دالة login من ApiService ونشتغل مع الاستجابة
        (response: any) => {
          // لو الطلب ناجح، هنا نعمل حاجة
          console.log('تم تسجيل الدخول بنجاح:', response);
          // طباعة الاستجابة في الكونسول عشان نشوف البيانات اللي جت (زي token واسم المستخدم)
          localStorage.removeItem('userData');
          localStorage.setItem('userData', JSON.stringify(response));
          localStorage.setItem('token', response.token); // حفظ التوكن لوحده
          // حفظ بيانات الاستجابة (زي firstName وpicture) في localStorage
          // JSON.stringify بتحول الكائن لسلسلة نصية عشان يتم حفظها

          if (this.rememberMe) {
            localStorage.setItem('savedEmail', this.email);
          } else {
            localStorage.removeItem('savedEmail');
          }

          this.authService.login(); // تغيير حالة تسجيل الدخول لـ true
          this.router.navigate(['/dashboard']); // الذهاب لصفحة Dashboard
        },
        (error) => {
          // لو الطلب فشل (زي كلمة مرور غلط)
          console.error('خطأ:', error); // طباعة الخطأ في الكونسول
          alert('فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.');
          // تنبيه المستخدم بطريقة بسيطة
        }
      );
    } else {
      alert('يرجى تعبئة جميع الحقول بشكل صحيح');
      // لو النموذج فيه حقل فاضي أو غير صالح، نعرض تنبيه
    }
  }
}
