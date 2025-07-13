import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; // أضفنا ViewChild وElementRef
import { CommonModule } from '@angular/common'; // جلب أدوات مشتركة زي *ngFor و*ngIf
import { ApiService } from '../../services/api.service'; // استيراد الخدمة اللي بتتعامل مع الـ API
import { Observable, fromEvent, debounceTime, distinctUntilChanged, map } from 'rxjs'; // استيراد RxJS operators

@Component({
  selector: 'app-alldoctor',
  standalone: true,
  imports: [CommonModule], // نضيف CommonModule عشان نستخدم *ngFor لعرض التخصصات والدكاترة
  templateUrl: './alldoctor.component.html',
  styleUrl: './alldoctor.component.scss',
})
export class AlldoctorComponent implements OnInit {
  specialities: any[] = []; // مصفوفة لتخزين التخصصات اللي جاية من getAllSpecialities
  doctors: any[] = []; // مصفوفة لتخزين كل الدكاترة (بيتم تحديثها حسب البحث أو الفلترة)
  displayedDoctors: any[] = []; // مصفوفة لتخزين الدكاترة المعروضين حسب الصفحة
  loading: boolean = true; // متغير للتحكم في عرض الـ Spinner أثناء التحميل
  selectedSpeciality: string | null = null; // لتخزين التخصص المختار للفلترة
  currentPage: number = 1; // الصفحة الحالية (بتبدأ من 1)
  itemsPerPage: number = 12; // عدد الدكاترة في كل صفحة
  totalPages: number = 0; // إجمالي الصفحات
  pages: number[] = []; // مصفوفة لأرقام الصفحات
  noDoctorsMessage: string | null = null; // رسالة لو مفيش دكاترة
  searchQuery: string = ''; // خاصية جديدة لتخزين قيمة البحث

  // استخدام ViewChild للوصول لحقل البحث
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>; // ! تعني إنه هيتم تهيئته، ونحدد النوع كـ HTMLInputElement

  constructor(private apiService: ApiService) {} // حقن الخدمة عشان نستخدمها

  ngOnInit() {
    // الدالة دي بتشتغل لما المكون يبقى جاهز
    this.fetchSpecialities(); // استدعاء التخصصات في البداية
    this.fetchAllDoctors(); // استدعاء كل الدكاترة في البداية
    this.setupSearchListener(); // إعداد المستمع للبحث التلقائي
  }

  // دالة لجلب التخصصات
  fetchSpecialities() {
    this.loading = true; // تفعيل الـ Spinner أثناء التحميل
    this.apiService.getAllSpecialities().subscribe({
      next: (data) => {
        this.specialities = data; // تخزين التخصصات في المصفوفة
        console.log('التخصصات المستلمة:', data); // طباعة للتحقق
        this.loading = false; // إخفاء الـ Spinner لما التحميل يخلص
      },
      error: (error) => {
        console.error('خطأ في جلب التخصصات:', error); // طباعة الخطأ لو فيه مشكلة
        this.loading = false; // إخفاء الـ Spinner حتى لو فشل
      },
    });
  }

  // دالة لجلب كل الدكاترة (بدون فلترة أو بحث)
  fetchAllDoctors() {
    this.loading = true; // تفعيل الـ Spinner
    this.noDoctorsMessage = null; // مسح الرسالة لو كانت موجودة
    this.selectedSpeciality = null; // مسح التخصص المختار
    this.searchQuery = ''; // مسح قيمة البحث
    this.apiService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = Array.isArray(data) ? data : []; // تحويل لمصفوفة لو الاستجابة صح
        if (this.doctors.length === 0) {
          this.noDoctorsMessage = 'لا يوجد دكاترة متاحة'; // رسالة لو مفيش دكاترة
        }
        this.updatePagination(); // تحديث الـ Pagination بعد جلب البيانات
        console.log('كل الدكاترة:', data); // طباعة للتحقق
        this.loading = false; // إخفاء الـ Spinner
      },
      error: (error) => {
        console.error('خطأ في جلب كل الدكاترة:', error); // طباعة الخطأ
        this.loading = false; // إخفاء الـ Spinner
      },
    });
  }

  // دالة لجلب الدكاترة حسب التخصص
  fetchDoctorsBySpecialization(specialityName: string) {
    this.loading = true; // تفعيل الـ Spinner
    this.noDoctorsMessage = null; // مسح الرسالة لو كانت موجودة
    this.selectedSpeciality = specialityName; // تخزين التخصص المختار
    this.searchQuery = ''; // مسح قيمة البحث
    this.apiService.getDoctorsBySpecialization(specialityName).subscribe({
      next: (data) => {
        this.doctors = Array.isArray(data) ? data : []; // تحويل لمصفوفة لو الاستجابة صح
        if (this.doctors.length === 0) {
          this.noDoctorsMessage = `لا يوجد دكاترة في التخصص: ${specialityName}`; // رسالة لو مفيش دكاترة
        }
        this.updatePagination(); // تحديث الـ Pagination
        console.log(`الدكاترة بتاعين ${specialityName}:`, data); // طباعة للتحقق
        this.loading = false; // إخفاء الـ Spinner
      },
      error: (error) => {
        console.error(`خطأ في جلب الدكاترة بتاعين ${specialityName}:`, error); // طباعة الخطأ
        this.loading = false; // إخفاء الـ Spinner
      },
    });
  }

  // دالة للبحث عن الدكاترة حسب الاسم مع مراعاة التخصص المختار
  searchDoctors(query: string) {
    this.loading = true; // تفعيل الـ Spinner
    this.noDoctorsMessage = null; // مسح أي رسالة خطأ سابقة
    this.currentPage = 1; // إعادة الصفحة للأول عند البحث

    // إذا كانت القيمة فارغة، رجوع لعرض الدكاترة حسب التخصص أو الكل
    if (!query.trim()) {
      if (this.selectedSpeciality) {
        this.fetchDoctorsBySpecialization(this.selectedSpeciality); // رجوع للتخصص المختار
      } else {
        this.fetchAllDoctors(); // رجوع لكل الدكاترة
      }
      return;
    }

    // استدعاء البحث من الـ API
    this.apiService.searchByDoctorName(query).subscribe({
      next: (data) => {
        this.doctors = Array.isArray(data) ? data : []; // تخزين الدكاترة المرجعة
        // لو فيه تخصص مختار، نفلتر النتائج يدويًا
        if (this.selectedSpeciality) {
          this.doctors = this.doctors.filter(doctor =>
            doctor.specialization === this.selectedSpeciality &&
            doctor.name.toLowerCase().includes(query.toLowerCase())
          );
        } else {
          this.doctors = this.doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(query.toLowerCase())
          );
        }
        if (this.doctors.length === 0) {
          this.noDoctorsMessage = `لا يوجد دكاترة يحتوون على "${query}"${this.selectedSpeciality ? ` في ${this.selectedSpeciality}` : ''}`;
        }
        this.updatePagination(); // تحديث الـ Pagination
        console.log(`نتائج البحث عن "${query}" مع ${this.selectedSpeciality || 'كل التخصصات'}:`, data);
        this.loading = false; // إخفاء الـ Spinner
      },
      error: (error) => {
        console.error(`خطأ في البحث عن "${query}":`, error); // طباعة الخطأ
        this.loading = false; // إخفاء الـ Spinner
        this.noDoctorsMessage = `فشل البحث عن "${query}"`; // رسالة خطأ
      },
    });
  }

  // دالة لتحديث الـ Pagination وتحديد الدكاترة المعروضين
  updatePagination() {
    this.totalPages = Math.ceil(this.doctors.length / this.itemsPerPage); // حساب إجمالي الصفحات
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1); // إنشاء مصفوفة الأرقام (1, 2, 3, ...)
    this.updateDisplayedDoctors(); // تحديث الدكاترة المعروضين بناءً على الصفحة الحالية
  }

  // دالة لتحديث الدكاترة المعروضين حسب الصفحة
  updateDisplayedDoctors() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage; // بداية النطاق
    const endIndex = startIndex + this.itemsPerPage; // نهاية النطاق
    this.displayedDoctors = this.doctors.slice(startIndex, endIndex); // استخراج الدكاترة المعروضين
  }

  // دالة تشتغل لما تضغط على زرار فلتر
  onFilterClick(specialityName: string | null) {
    this.currentPage = 1; // إعادة الصفحة للأول لما يتغير الفلتر
    this.searchQuery = ''; // مسح قيمة البحث لما يتغير الفلتر
    if (specialityName === null) {
      this.fetchAllDoctors(); // لو الضغط على "كل التخصصات"، جيب كل الدكاترة
    } else {
      this.fetchDoctorsBySpecialization(specialityName); // لو تخصص معين، جيب الدكاترة بتاعينه
    }
  }

  // دالة لتغيير الصفحة
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page; // تحديث الصفحة الحالية
      this.updateDisplayedDoctors(); // تحديث الدكاترة المعروضين
    }
  }

  // دالة جديدة للبحث التلقائي
  onSearch(query: string) {
    this.searchQuery = query; // تحديث قيمة البحث
    this.searchDoctors(query); // استدعاء دالة البحث المدمجة
  }

  // دالة لإعداد المستمع للبحث مع تأخير (debounce)
  setupSearchListener() {
    // التأكد إن حقل البحث موجود قبل الاستماع
    if (this.searchInput && this.searchInput.nativeElement) {
      fromEvent(this.searchInput.nativeElement, 'input').pipe(
        debounceTime(300), // انتظار 300 ملي ثانية بعد آخر تغيير
        distinctUntilChanged(), // تجاهل التغييرات المتكررة
        map((event: Event) => (event.target as HTMLInputElement).value) // استخراج قيمة الحقل باستخدام Type Casting
      ).subscribe((query: string) => {
        this.onSearch(query); // استدعاء دالة البحث
      });
    }
  }
}
