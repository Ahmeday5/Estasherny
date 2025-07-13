import { Component, OnInit, AfterViewInit } from '@angular/core';
// استيراد Component، الديكوريتر الأساسي لإنشاء مكونات في Angular
// OnInit وAfterViewInit واجهات بتشتغل لما المكون يتحمّل أو بعد تحميل العرض.

import { Router, RouterModule } from '@angular/router';
// استيراد Router عشان نتحكم في التنقل بين الصفحات
// وRouterModule عشان نستخدم routerLink وrouterLinkActive في HTML.

import { AuthService } from '../../services/auth.service';
// استيراد AuthService عشان نستخدم دالة logout
// الخدمة دي بتدير حالة تسجيل الدخول باستخدام BehaviorSubject.

import { CommonModule } from '@angular/common';
// استيراد CommonModule اللي فيه توجيهات زي ngClass
// ده بيخلّي نعمل ديناميكية في التصميم حسب الحالة.

@Component({
  selector: 'app-sidebar', // المحدد اللي هيظهر في HTML زي <app-sidebar></app-sidebar>
  // ده بيكون زي العلامة اللي بنستخدمها عشان ندخل المكون في الصفحة.
  standalone: true, // جعل المكون مستقل، يعني مش محتاج موديول منفصل
  // standalone بيخلّي المكون يشتغل لوحده بدون الحاجة لـ NgModule.
  imports: [RouterModule, CommonModule], // إضافة RouterModule لدعم routerLink و routerLinkActive
  // RouterModule بيدعم الروابط الديناميكية، وCommonModule لـ ngClass.
  templateUrl: './sidebar.component.html', // مسار ملف HTML الخاص بالمكون
  // ده بيربط المكون بملف HTML اللي فيه التصميم.
  styleUrls: ['./sidebar.component.scss'], // مسار ملفات CSS الخاصة بالمكون
  // ده بيربط المكون بملفات CSS اللي بتحدد الألوان والتنسيقات.
})
export class SidebarComponent implements OnInit, AfterViewInit {
  // تنفيذ واجهتين: OnInit للتهيئة الأولية، AfterViewInit لما العرض يتحمّل.

  isSidebarOpen: boolean = window.innerWidth > 992;
  // تعريف متغير isSidebarOpen من نوع boolean
  // القيمة الافتراضية بتحدد إذا كان الـ Sidebar مفتوح حسب عرض الشاشة
  // window.innerWidth > 992 بتعني إن الـ Sidebar هيبقى مفتوح لما العرض أكبر من 992 بكسل.

  // قائمة العناصر في الـ Sidebar
  menuItems = [
    {
      label: 'الرئيسية',
      path: '/dashboard',
      icons: 'fa-solid fa-house', // أيقونة منزل للرئيسية
    },
    {
      label: 'دكتور',
      path: null, // null عشان ما يوديش لمسار، بس يفتح الـ submenu
      icons: 'fa-solid fa-user-md', // أيقونة دكتور
      submenu: [
        {
          key: 'جميع الأطباء',
          path: '/alldoctor',
          icon: 'fa-solid fa-briefcase-medical',
        },
        {
          key: 'إنشاء وتعديل حسابات الأطباء',
          path: '/order',
          icon: 'fa-solid fa-house-medical',
        },
      ],
    },
    {
      label: 'المستخدمين',
      path: null, // null عشان ما يوديش لمسار، بس يفتح الـ submenu
      icons: 'fa-solid fa-users', // أيقونة مجموعة مستخدمين
      isOpen: false,
      submenu: [
        { key: 'المستخدمين', path: '/order', icon: 'fa-solid fa-users' },
        {
          key: 'إضافة مستخدم جديد',
          path: '/order',
          icon: 'fa-solid fa-user-plus',
        },
      ],
    },
    {
      label: 'التقارير',
      path: '/order',
      icons: 'fa-solid fa-chart-bar', // أيقونة مخطط للتقارير
    },
    {
      label: 'إضافة خصم',
      path: '/add-discount',
      icons: 'fa-solid fa-percent', // أيقونة نسبة مئوية للخصم
    },
    {
      label: 'التخصصات',
      path: '/specialties',
      icons: 'fa-solid fa-stethoscope', // أيقونة سماعة طبيب للتخصصات
    },
    {
      label: 'الإشعارات',
      path: '/notifications',
      icons: 'fa-solid fa-bell', // أيقونة جرس للإشعارات
    },
    {
      label: 'تسجيل الخروج', // إضافة عنصر تسجيل الخروج للقائمة
      path: null, // path بيكون null عشان ما يربطش بمسار معين
         icons: 'fa-solid fa-sign-out-alt', // أيقونة خروج

    },
  ];

  // حقن Router و AuthService
  constructor(private authService: AuthService, private router: Router) {
    // حقن AuthService عشان نستخدم دالة logout
    // AuthService بتدير حالة تسجيل الدخول، وحقنها بتخلّيها متاحة هنا.
    // حقن Router عشان نتحكم في التنقل
    // Router بيخلّينا نغير المسارات زي الذهاب لـ / بعد تسجيل الخروج.
  }

  // التهيئة عند تحميل الكومبوننت
  ngOnInit(): void {
    // لا حاجة لتهيئة إضافية
    // ngOnInit بتشتغل لما المكون يتحمّل، لكن هنا مفيش حاجة زيادة.
  }

  // بعد تحميل العرض
  ngAfterViewInit(): void {
    // إضافة مستمع لتغيير حجم النافذة
    window.addEventListener('resize', () => {
      this.isSidebarOpen = window.innerWidth > 992;
      // بتحدث قيمة isSidebarOpen كل ما حجم النافذة يتغير
      // window.innerWidth > 992 بتعني إن الـ Sidebar هيبقى مفتوح لما العرض يكون أكبر من 992 بكسل.
    });
  }

  // فتح/قفل الـ Sidebar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    // عكس قيمة isSidebarOpen (من true لـ false أو العكس)
    // ده بيغير حالة الـ Sidebar بين المفتوحة والمغلقة.
  }

  // دالة تسجيل الخروج
  logout(): void {
    this.authService.logout(); // استدعاء دالة logout من AuthService
    // logout بتمسح حالة تسجيل الدخول والبيانات من localStorage.
    this.router.navigate(['/']); // التنقل إلى الرئيسية بعد الخروج
    // navigate بيغير المسار لـ /، وده بيوجه المستخدم للصفحة الافتتاحية.
  }

  // التحقق إذا كان الرابط نشطًا
  isActive(path: string): boolean {
    return path
      ? this.router.isActive(path, {
          paths: 'subset',
          queryParams: 'subset',
          fragment: 'ignored',
          matrixParams: 'ignored',
        })
      : false;
    // isActive بترجع true لو الرابط النشط يتطابق مع المسار المعطى
    // التحقق من path بيضمن إن المسار مش null، ولو null يرجع false
    // الخيارات دي بتحدد كيفية المقارنة.
  }

  // دالة للتحقق إذا كان العنصر هو زر تسجيل الخروج
  isLogoutItem(item: any): boolean {
    return item.label === 'تسجيل الخروج';
    // بترجع true لو العنصر في القائمة ليه اسم "تسجيل الخروج"
    // ده بيساعد في التمييز بين الروابط العادية والخروج.
  }

  // دالة لفتح/إغلاق القائمة الفرعية
  toggleSubmenu(index: number): void {
    this.menuItems[index].isOpen = !this.menuItems[index].isOpen;
    // تغيير حالة isOpen للعنصر المحدد بالمؤشر
    // ده بيفتح أو يغلق القائمة الفرعية.
  }
}
