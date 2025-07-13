import { Component } from '@angular/core';
// استيراد Component، الديكوريتر الأساسي لإنشاء مكونات في Angular
// ده بيخلّي Angular يعرف إن الكلاس ده مكون يمكن نستخدمه في HTML.

import { Router, RouterOutlet } from '@angular/router';
// استيراد Router عشان نتحكم في التنقل بين الصفحات (مثل الذهاب لـ /login)
// وRouterOutlet عشان نعرض المكونات بناءً على المسار النشط.

import { AuthService } from './services/auth.service';
// استيراد خدمة المصادقة عشان نتحقق من حالة تسجيل الدخول
// الخدمة دي بتدير حالة الـ logged-in باستخدام BehaviorSubject.

import { Observable } from 'rxjs';
// استيراد Observable من RxJS عشان نستخدم المتغيرات اللي بتدير البيانات بطريقة غير متزامنة
// ده بيخلّي التطبيق يشتغل بدون توقف لحد ما الـ API يرجع الرد.

import { take } from 'rxjs/operators';
// استيراد take من RxJS عشان نقتصر على قيمة واحدة بس من Observable
// ده بيمنع التكرار اللا نهائي عن طريق إلغاء الاشتراك بعد أول قيمة.

import { CommonModule } from '@angular/common';
// استيراد CommonModule اللي فيه توجيهات زي *ngIf و*ngFor
// ده بيخلّي نعمل شروط وتكرار في HTML.

import { SidebarComponent } from './layout/sidebar/sidebar.component';
// استيراد مكون Sidebar عشان نعرضه لو المستخدم مسجل دخول
// المكون ده بيكون جزء من الـ layout الجانبي.

import { NgwWowService } from 'ngx-wow';
// استيراد NgwWowService من ngx-wow عشان ندمج تأثيرات التمرير
// ده بيخلّي العناصر تتحرك لما المستخدم يتمرر في الصفحة.

import { HeaderComponent } from './layout/header/header.component';
// استيراد مكون Header عشان يظهر في كل الصفحات
// المكون ده بيحتوي على الـ breadcrumbs وزر الخروج.

@Component({
  selector: 'app-root', // المحدد اللي هيظهر في index.html زي <app-root></app-root>
  // ده بيكون زي العلامة اللي بنستخدمها عشان ندخل المكون في الصفحة الرئيسية.
  standalone: true, // جعل المكون مستقل، يعني مش محتاج موديول منفصل
  // standalone بيخلّي المكون يشتغل لوحده بدون الحاجة لـ NgModule.
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent],
  // استيراد الوحدات والمكونات اللي المكون بيدور عليها
  // RouterOutlet بيعرض المكونات حسب المسار، وCommonModule للتوجيهات.
  templateUrl: './app.component.html', // مسار ملف HTML الخاص بالمكون
  // ده بيربط المكون بملف HTML اللي فيه التصميم.
  styleUrl: './app.component.scss', // مسار ملف CSS الخاص بالمكون
  // ده بيربط المكون بملف CSS اللي بيحدد الألوان والتنسيقات.
})
export class AppComponent {
  title = 'order-gomla-dashboard';
  // تعريف متغير title بقيمة افتراضية، ممكن نستخدمه في HTML لو حابين
  // ده زي العنوان اللي ممكن نعرضه في الصفحة.

  isLoggedIn$: Observable<boolean>;
  // تعريف متغير عام من نوع Observable بيحتوي على حالة تسجيل الدخول
  // الـ $ بيدل على إنه Observable، وبنستخدمه في الشرط في HTML
  // Observable بتخلّي المتغير يتحدث تلقائي لما يتغير.

  private wowService: NgwWowService;
  // تعريف متغير wowService من نوع NgwWowService
  // استخدمنا private عشان نمنع التعديل المباشر من برا الكلاس
  // NgwWowService بتحتوي على دوال زي init عشان تبدا التأثيرات.

  constructor(
    private authService: AuthService, // حقن AuthService عشان نستخدم دوالها زي isLoggedIn$
    // AuthService بتدير حالة تسجيل الدخول، وحقنها بتخلّيها متاحة هنا.
    private router: Router, // حقن Router عشان نتحكم في التنقل
    // Router بيخلّينا نغير المسارات زي الذهاب لـ /login لو المستخدم مش مسجل.
    private ngwWowService: NgwWowService // حقن NgwWowService عشان نستخدم تأثيرات التمرير
    // ngwWowService بيمدنا بدوال زي init عشان نفعل الـ WOW.js.
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$; // تهيئة المتغير من الخدمة
    // بنأخد قيمة isLoggedIn$ من AuthService عشان نتابعها.
    this.checkAuth(); // استدعاء دالة التحقق من الحالة
    // ده بيخلّي الدالة تتحقق من تسجيل الدخول فورًا.
    this.wowService = this.ngwWowService; // ربط wowService بخدمة NgwWowService
    // ده بيحل الخطأ بتاع undefined عشان نستخدم الخدمة صح.
    this.wowService.init(); // تهيئة خدمة NgwWowService
    // init بيبدا تأثيرات التمرير، وبنستدعيها بعد الربط.
  }

  // دالة للتحقق من تسجيل الدخول وحماية الروابط
  checkAuth(): void {
    // تعريف دالة بترجع void (مفيش عائد)
    // void بتعني إن الدالة مش هترجع قيمة، بس بتعمل عمليات.
    this.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
      // الاشتراك في Observable عشان نتابع التغيرات في حالة تسجيل الدخول
      // take(1) بيقتصر على قيمة واحدة بس ويوقف الاشتراك تلقائي
      // ده بيمنع التكرار اللا نهائي اللي بيسبب Maximum call stack size exceeded.
      if (!isLoggedIn) { // لو المستخدم مش مسجل دخول (false)
        // !isLoggedIn بتحول القيمة للعكس، يعني لو false هيبقى true.
        this.authService.logout(); // إعادة تعيين الحالة للتأكد
        // logout بتمسح الحالة والبيانات من localStorage.
        this.router.navigate(['/login']); // توجيه المستخدم لصفحة تسجيل الدخول
        // navigate بيغير المسار لـ /login لو المستخدم مش مخول.
      }
    });
    // استخدام take(1) بيدي التحكم الكامل ويمنع الحلقة المفرغة
  }
}
