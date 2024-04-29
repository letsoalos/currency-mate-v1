import { Component, OnInit } from '@angular/core';
import { AppService } from './core/service/app.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  conversionRates: any;
  form: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllCurrencies();
  }

  getForm(): any {

  }

  getAllCurrencies() {
    this.appService.getAllCurrencies().subscribe({
      next: (res) => {
        console.log('cunrrencies', res);       
      },
      error: (err) => console.error(err)
    })
  }
  
}
