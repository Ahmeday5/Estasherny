import { Injectable } from '@angular/core';
// استيراد Injectable من Angular، وهي ديكوريتر بتحدد إن الخدمة يمكن حقنها
// في أي مكون أو خدمة تانية داخل التطبيق.

import { BehaviorSubject } from 'rxjs';
// استيراد BehaviorSubject من RxJS، وهو نوع خاص من الـ Observables
// بيخلّي المتغيرات تتصرف زي مصدر بيانات يمكن الاشتراك فيه ويحتفظ بآخر قيمة.

@Injectable({
  providedIn: 'root', // تحديد إن الخدمة هتكون متاحة عبر التطبيق كامل
  // 'root' بيخلي Angular ينشئ كائن واحد من الخدمة ويستخدمه في كل مكان
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('isLoggedIn') === 'true' // التحقق من localStorage
    // localStorage.getItem بيجيب القيمة المخزنة تحت مفتاح 'isLoggedIn'
    // لو القيمة هي 'true'، بيحولها لـ true، لو لأ بيرجع false
  );
  // تعريف متغير خاص (private) بيحتفظ بحالة تسجيل الدخول
  // BehaviorSubject بيحتفظ بالقيمة الأخيرة ويسمح للاشتراكين يشوفوها.

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  // تعريف متغير عام (public) بيحول BehaviorSubject لـ Observable
  // الـ $ عادة بتستخدم كدليل إن المتغير ده Observable، وبيخلّي المكونات تستخدمه بدون تعديل القيمة مباشرة.

  login(): void {
    // دالة بتغير حالة تسجيل الدخول لـ true
    this.isLoggedInSubject.next(true); // بتغير القيمة داخل BehaviorSubject لـ true
    // next بتحدث القيمة وتنبه كل اللي ماشترك في الـ Observable
    localStorage.setItem('isLoggedIn', 'true'); // حفظ الحالة في localStorage
    // setItem بيخزن قيمة 'true' تحت مفتاح 'isLoggedIn' عشان يتذكرها عند إعادة التحميل
  }

  logout(): void {
    // دالة بتغير حالة تسجيل الدخول لـ false وتمسح البيانات
    if (this.isLoggedInSubject.value) {
      // التحقق إذا كان مسجل دخول
      // this.isLoggedInSubject.value بتحصل على القيمة الحالية بدون تنبيه الاشتراكين
      this.isLoggedInSubject.next(false); // بتغير القيمة لـ false
      // next بتحدث القيمة وتنبه الاشتراكين، لكن التحقق السابق بيمنع التكرار.
      localStorage.removeItem('isLoggedIn'); // إزالة مفتاح 'isLoggedIn' من localStorage
      // removeItem بيمسح القيمة المرتبطة بالمفتاح عشان م يظلش مسجل دخول بعد الخروج
      localStorage.removeItem('userData'); // إزالة بيانات المستخدم
      // ده بيمسح بيانات المستخدم (زي الاسم والصورة) عشان م تظلش محفوظة
      localStorage.removeItem('savedEmail');
    }
  }

  // دالة لجلب بيانات المستخدم من localStorage
  getUserData(): any {
    // تعريف دالة ترجع بيانات المستخدم أو null لو مفيش
    const userData = localStorage.getItem('userData'); // جلب البيانات من localStorage
    // getItem بيجيب السلسلة النصية المخزنة تحت 'userData'
    return userData ? JSON.parse(userData) : null;
    // لو userData موجود (مش null)، بيحوله من نص لكائن باستخدام JSON.parse
    // لو مش موجود، بيرجع null عشان ميخلّيش خطأ
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('توكن من AuthService:', token); // طباعة للتحقق
    return token;
  }
}
