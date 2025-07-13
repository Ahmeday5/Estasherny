import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // جلب أدوات مشتركة

import { HttpClient } from '@angular/common/http'; // استيراد خدمة HTTP لجلب البيانات
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  statsLoaded = false; // متغير للتحكم في عرض البيانات أو الـ Spinner

  cardStats: any[] = []; // مصفوفة لتخزين بيانات الكاردات

  loadingTemplate!: TemplateRef<any>; // تعريف loadingTemplate كـ TemplateRef، الـ ! بيخلي TypeScript يتجاهل التحقق من القيمة الافتراضية

  constructor(private apiService: ApiService, private http: HttpClient) {} // حقن الخدمة

  ngOnInit() {
    // دالة بتشتغل لما المكون يبقى جاهز
    this.fetchStatsOrders(); // استدعاء الدالة اللي بتجيب البيانات
  }

  fetchStatsOrders() {
    this.statsLoaded = false; // إظهار الـ Spinner أثناء التحميل

    // استخدام forkJoin لجلب جميع البيانات في وقت واحد
    forkJoin({
      totalProfit: this.apiService.getTotalProfit(),
      profitToday: this.apiService.getProfitToday(),
      totalAppointments: this.apiService.getTotalAppointmentsCount(),
      todayAppointments: this.apiService.getTodayAppointmentsCount(),
      totalPatients: this.apiService.getTotalPatientsCount(),
      todayPatients: this.apiService.getTodayPatientsCount(),
    }).subscribe({
      next: (data) => {
        // تعبئة الكاردات بناءً على البيانات
        this.cardStats = [
          {
            id: 1,
            label: 'مواعيد جديدة',
            value: data.totalAppointments.totalToday || 0, // من getProfitToday
            valueToday: data.todayAppointments.total || 0, // من getTodayPatientsCount
            imgIcon: '/assets/img/dashboard/appio.png',
          },
          {
            id: 2,
            label: 'المرضي الجدد',
            value: data.totalPatients.total || 0, // من getTotalAppointmentsCount
            valueToday: data.todayPatients.total || 0, // من getTodayAppointmentsCount
            imgIcon: '/assets/img/dashboard/pati.png',
          },
          {
            id: 3,
            label: 'الربح',
            value: data.totalProfit.total || 0, // من getTotalProfit
            valueToday: data.profitToday.totalToday || 0, // من getProfitToday
            imgIcon: '/assets/img/dashboard/profit.png',
          },
        ];
        this.statsLoaded = true;
      },
      error: (error) => {
        console.error('مشكلة في جلب الـ Stats:', error);
        this.statsLoaded = true;
      },
    });
  }

  getStatClass(label: string): string {
    // دالة تحدد الكلاس
    switch (
      label // التحقق من الملصق
    ) {
      case 'المبلغ المطلوب منك':
      case 'المبلغ الصافي':
      case 'عدد الطلبات اليوم / الشهر':
        return 'white-div'; // خلفية بيضا
      case 'المبلغ المستحق لك':
      case 'عدد الموردين النشطين':
      case 'نسبة النمو أو التراجع':
        return 'blue-div'; // خلفية زرقا
      default:
        return ''; // افتراضي
    }
  }
}
