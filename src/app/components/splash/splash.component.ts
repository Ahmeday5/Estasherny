import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent implements OnInit {
  // OnInit بيشتغل لما المكون يتحمل
  constructor(private router: Router) {} // انشاء كائن Router عشان نتحرك

  ngOnInit(): void {
    // الدالة اللي بتشتغل اول ما المكون يتحمل
    // بعد 2 ثانية (كفاية لمشاهدة الانيميشن)، نروح لصفحة تسجيل الدخول
    setTimeout(() => {
      // دالة بتؤخر التنفيذ
      this.router.navigate(['/login']); // نروح للمسار /login
    }, 2000); // 2000 مللي ثانية = 2 ثانية
  }
}
