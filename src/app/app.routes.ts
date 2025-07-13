import { CanActivateFn, Routes } from '@angular/router';
// استيراد CanActivateFn من @angular/router، دي دالة بتتحقق من صلاحية الدخول للمسار
// وبتساعد في حماية الروابط. كمان، استيراد Routes عشان نحدد القائمة بتاعة المسارات.

import { SplashComponent } from './components/splash/splash.component';
// استيراد مكون SplashComponent، ده المكون اللي بيظهر لما المستخدم يفتح الرئيسية (/)
// بيكون الصفحة الأولى اللي المستخدم يشوفها.

import { LoginComponent } from './components/login/login.component';
// استيراد مكون LoginComponent، ده المكون اللي بيسمح للمستخدم يسجل دخول
// بيظهر لما المسار يكون /login.

import { DashboardComponent } from './components/dashboard/dashboard.component';
// استيراد مكون DashboardComponent، ده الصفحة الرئيسية بعد تسجيل الدخول
// بيظهر لما المسار يكون /dashboard.

import { addDoctorComponent } from './components/AddDoctor/AddDoctor.component';
// استيراد مكون AllOrdersComponent، بيظهر قائمة الطلبيات
// بيشتغل لما المسار يكون /allorders.

import { AlldoctorComponent } from './components/AllDoctor/alldoctor.component';
// استيراد مكون OrdersComponent، بيظهر تفاصيل الطلبيات
// بيشتغل لما المسار يكون /order.

import { ReturnsComponent } from './components/headerOrders/returns/returns.component';
// استيراد مكون ReturnsComponent، بيظهر المرتجعات
// بيشتغل لما المسار يكون /return.

import { AuthService } from './services/auth.service';
// استيراد AuthService، الخدمة اللي بتدير حالة تسجيل الدخول
// بتستخدم BehaviorSubject عشان تعكس التغيرات في الـ logged-in state.

import { map, Observable } from 'rxjs';
// استيراد map من RxJS عشان نعمل تحويل على البيانات
// وObservable عشان نرجع قيمة غير متزامنة تناسب CanActivateFn.

import { inject } from '@angular/core';
// استيراد inject من @angular/core، ده بيخلّي Angular يوفر مثيل من الخدمات
// زي AuthService وRouter تلقائي داخل الدوال.

import { Router } from '@angular/router';
// استيراد Router عشان ننشئ UrlTree للتوجيه
// Router بيخلّينا نحدد المسار بدقة باستخدام شجرة مسارات (UrlTree).

export const canActivate: CanActivateFn = (route, state) => {
  // تعريف دالة CanActivate، دي بتشتغل قبل ما المستخدم يدخل أي مسار
  // route بتحتوي على بيانات المسار الحالي (مثل الباراميترات إن وجدت).
  // state بتحتوي على حالة التنقل (مثل المسار الكامل والبيانات المرتبطة).
  const authService = inject(AuthService); // حقن AuthService
  // inject بيجيب مثيل من AuthService من Angular DI (Dependency Injection)
  // ده بديل لـ getInstance اللي كان غلط ومش مدعوم في الإصدارات الحديثة.
  const router = inject(Router); // حقن Router
  // inject بيجيب مثيل من Router عشان نستخدمه لإنشاء UrlTree
  // Router ضروري هنا عشان نحدد المسار اللي هيوجه ليه لو المستخدم مش مخول.

  return authService.isLoggedIn$.pipe(
    // رجوع Observable من isLoggedIn$ اللي بتحتوي على true أو false
    // pipe بتسمح لينا نضيف عمليات على الـ Observable زي map.
    map((isLoggedIn) => {
      // map بتعمل تحويل على القيمة اللي جت من Observable
      // هنا بنفحص إذا المستخدم مسجل دخول ولا لأ.
      if (!isLoggedIn) {
        // لو المستخدم مش مسجل دخول (false)
        // !isLoggedIn بتحول القيمة للعكس، يعني لو false هيبقى true ويدخل الشرط.
        return router.createUrlTree(['/login']); // إرجاع UrlTree لتوجيه المستخدم
        // createUrlTree بينشئ شجرة مسار لـ /login، وده اللي Angular 18 بيتوقعه
        // بدل الـ string[] القديمة زي ['/login'].
      }
      return true; // لو المستخدم مسجل دخول، نرجع true عشان يسمح بدخول المسار
      // true بيعني إن الدخول مسموح، وبتناسب نوع GuardResult.
    })
  );
  // الدالة ككل بترجع Observable<boolean | UrlTree>
  // ده النوع اللي CanActivateFn بيتوقعه في Angular 18 مع الوضع الـ Standalone.
};

export const routes: Routes = [
  { path: '', component: SplashComponent }, // المسار الرئيسي (/) بيظهر Splash
  // path فارغ بيعني الصفحة اللي تفتح لما المستخدم يدخل الموقع
  // SplashComponent بيكون الافتتاحية.
  { path: 'login', component: LoginComponent }, // صفحة تسجيل الدخول
  // المسار /login بيربط بمكون LoginComponent عشان يسجل الدخول
  // ده المسار الوحيد اللي مش محتاج حماية.
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivate], // حماية المسار باستخدام CanActivate
    // canActivate بيخلّي المسار يتحقق من تسجيل الدخول قبل السماح
    // [canActivate] بيعني إن الدالة هتشتغل كجزء من مصفوفة الحماية.
    data: { breadcrumb: 'الرئيسية' }, // إضافة بيانات للـ breadcrumb
    // breadcrumb بيحدد الاسم اللي هيظهر في مسار التنقل في الهيدر.
  },
  {
    path: 'allorders',
    component: addDoctorComponent,
    canActivate: [canActivate], // حماية المسار
    data: { breadcrumb: 'الطلبيات' },
  },
  {
    path: 'alldoctor',
    component: AlldoctorComponent,
    canActivate: [canActivate], // حماية المسار
    data: { breadcrumb: 'الطلبيات' },
  },
  {
    path: 'return',
    component: ReturnsComponent,
    canActivate: [canActivate], // حماية المسار
    data: { breadcrumb: 'المرتجعات' },
  },
  { path: '**', redirectTo: '' }, // مسار افتراضي لو المسار مش موجود، يرجع للرئيسية
  // ** بيعني أي مسار مش معرف (wildcard)، وredirectTo بيوجه للمسار الفارغ (Splash).
];
