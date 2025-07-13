import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // جلب أداة HTTP
import { catchError, map, Observable, throwError } from 'rxjs'; // جلب أداة الملاحظات

@Injectable({
  providedIn: 'root', // جعل الخدمة متاحة لكل التطبيق
})
export class ApiService {
  private baseUrl = 'http://37.34.238.190:9292/TheOneAPIEstasherny';

  constructor(private http: HttpClient) {} // انشاء كائن HttpClient

  //login

  // دالة جديدة لتسجيل الدخول
  login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Observable<any> {
    // تعريف دالة login تاخد كائن credentials فيه البريد وكلمة المرور
    // العائدة من الدالة هتبقى Observable من نوع any (يمكن نحدده لاحقًا زي { token: string })
    const loginUrl = `${this.baseUrl}/api/Dashboard/loginEmployee`;
    // بنبني عنوان URL كامل عن طريق دمج baseUrl مع نهاية المسار /api/Dashboard/loginEmployee
    // الـ `${}` بيسمح لينا نستخدم متغيرات داخل السلسلة (String Interpolation).

    return (
      this.http
        .post(loginUrl, credentials) // إجراء طلب HTTP من نوع POST
        // post بترسل بيانات (credentials) للـ API، وبتستقبل الاستجابة
        .pipe(
          catchError((error) => {
            // إذا حصل خطأ (مثل كلمة مرور غلط)
            console.error('خطأ في تسجيل الدخول:', error); // طباعة الخطأ في الكونسول للمساعدة في التصحيح
            return throwError(() => new Error('فشل تسجيل الدخول')); // إرجاع خطأ كـ Observable
            // new Error بيخلق كائن خطأ بنكتبه فيه رسالة واضحة للمستخدم
          })
        )
    );
    // pipe بتسمح لينا نضيف عمليات على الـ Observable، هنا نستخدم catchError بس
  }

  /************************************************Dasboard*************************************************************** */

  // الاند بوينتات الجديدة
  getTotalProfit(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getTotalProfit`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب المبلغ الصافي:', error);
          return throwError(() => new Error('فشل جلب المبلغ الصافي'));
        })
      );
  }

  getProfitToday(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getProfitToday`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب الأرباح اليوم:', error);
          return throwError(() => new Error('فشل جلب الأرباح اليوم'));
        })
      );
  }

  getTotalAppointmentsCount(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getTotalAppointmentsCount`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب إجمالي المواعيد:', error);
          return throwError(() => new Error('فشل جلب إجمالي المواعيد'));
        })
      );
  }

  getTodayAppointmentsCount(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getTodayAppointmentsCount`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مواعيد اليوم:', error);
          return throwError(() => new Error('فشل جلب مواعيد اليوم'));
        })
      );
  }

  getTotalPatientsCount(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getTotalPatientsCount`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب إجمالي المرضى:', error);
          return throwError(() => new Error('فشل جلب إجمالي المرضى'));
        })
      );
  }

  getTodayPatientsCount(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getTodayPatientsCount`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مرضى اليوم:', error);
          return throwError(() => new Error('فشل جلب مرضى اليوم'));
        })
      );
  }

  /***************************************************alldoctor************************************************************ */

  getAllSpecialities(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getAllSpecialities`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب التخصصات:', error);
          return throwError(() => new Error('فشل جلب التخصصات'));
        })
      );
  }

  // دالة جديدة لجلب كل الدكاترة
  getAllDoctors(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/getAllDoctors`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب كل الدكاترة:', error);
          return throwError(() => new Error('فشل جلب كل الدكاترة'));
        })
      );
  }

  // دالة جديدة لجلب الدكاترة حسب التخصص
  getDoctorsBySpecialization(specialityName: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Dashboard/getDoctorsBySpecialization?specialization=${specialityName}`; // نزود الاسم كما هو بدون encodeURIComponent
    return this.http
      .get(url, { headers, responseType: 'text' }) // نغير responseType لـ text
      .pipe(
        map((response) => {
          try {
            // حاول تحويل الاستجابة لـ JSON
            const parsedResponse = JSON.parse(response);
            // استخرج الـ data بس
            return parsedResponse.data || [];
          } catch (e) {
            // لو فيه خطأ (يعني نص)، رجّع مصفوفة فارغة
            return response === 'There is No Doctors with this specialization'
              ? []
              : [];
          }
        }),
        catchError((error) => {
          console.error(`خطأ في جلب الدكاترة بتاعين ${specialityName}:`, error);
          return throwError(
            () => new Error(`فشل جلب دكاترة ${specialityName}`)
          );
        })
      );
  }

  searchByDoctorName(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Dashboard/searchByDoctorName?name=${name}`;
    return this.http.get<any>(url, { headers }).pipe( // رجعنا لـ JSON بدل text
      map((response) => Array.isArray(response) ? response : []), // معالجة الـ array مباشرة
      catchError((error) => {
        console.error(`خطأ في البحث عن الاسم "${name}":`, error);
        return throwError(() => new Error(`فشل البحث عن الاسم "${name}"`));
      })
    );
  }

  /***************************************************alldoctor************************************************************ */
}
