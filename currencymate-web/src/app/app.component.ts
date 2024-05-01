import { Component, OnInit } from '@angular/core';
import { AppService } from './core/service/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyRateDto } from './core/data/currency-data';
import { CurrencyDto } from './shared/models/currency';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UpdateCurrencyComponent } from './update-currency/update-currency.component';
import { DeleteCurrencyComponent } from './delete-currency/delete-currency.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  baseCode: string  = 'ZAR';
  conversionRates: { [key: string]: number };
  form: FormGroup;
  fromCurrency: string = 'ZAR';
  toCurrency: string;
  conversionRate: number;
  currencyName: string = '';
  currencies: any | [] = [];
  noCurrency: boolean = false;
  bsModalRef: any;

  constructor(
          private appService: AppService, 
          private fb: FormBuilder,  
          private toastrService: ToastrService,
          private modalService: BsModalService) {}

  ngOnInit(): void {
    this.getAllCurrencies();
    this.getCurrencies();
    this.getForm();
  }

  getForm(): any {
    this.baseCode = 'ZAR'; 
    this.form = this.fb.group({
      sourceCurrent:[''],
      destinationCurrency:[''],
      amount:[''],
      currencyName:['']
    });
  }

  getAllCurrencies() {
    this.appService.getAllCurrencies().subscribe({
      next: (res: any) => {
        if (res && typeof res === 'object') {
          this.baseCode = res.base_code;
          this.conversionRates = res.conversion_rates;
        }
      },
      error: (err) => this.toastrService.error('Something went wrong', 'Error')
    })
  }

  getCurrencies() {
    this.noCurrency = true;
    this.appService.getCurrencies().subscribe({
      next: (res: any) => {
        this.currencies = res;
        if(this.currencies.length > 0) this.noCurrency = false;
      },
      error: (err) => {
        this.toastrService.error('Something went wrong', 'Error');
        console.log('Error', err);
      }
    })
  }

  get formControls(): any { return this.form.controls; }

  convertCurrency() {
    const destinationCurrency = this.formControls.destinationCurrency.value;
    const sourceCurrency = this.formControls.sourceCurrent.value;
    this.currencyName = this.formControls.destinationCurrency.value;

    if (destinationCurrency && sourceCurrency) {
      this.appService.getCurrencyRate(sourceCurrency, destinationCurrency).subscribe({
        next: (res) => {
          this.conversionRate = res.conversion_rate;
          this.baseCode = res.base_code;
          const savePayload: CurrencyRateDto = {
            exchangeRateToZAR: this.conversionRate,
            name: destinationCurrency,
            code: sourceCurrency
          }
          this.saveCurrencyRate(savePayload);
        },
        error: (err) => {
          this.toastrService.error('Something went wrong', 'Error');
          console.log('Error', err);
        }
      })
    } else {
      this.toastrService.error('We expecting value from current destination and source currency', 'Error');
    }
  }

  saveCurrencyRate(data: CurrencyRateDto) {
    this.appService.saveCurrencyRate(data).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.toastrService.success('Saved successfully.', 'Success');
          this.getCurrencies();            
        } else {
          this.toastrService.error('Something went wrong', 'Error');
        }
      },
      error: (err) => {
        this.toastrService.error('Something went wrong', 'Error');
            console.log('Error', err);
      }
    })
  }

  updateCurrencyRate(action: string, data: CurrencyRateDto) {
    const model = data;
    const userAction = action;
    const config = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-lg',
    initialState: { model, userAction }
    };
      this.bsModalRef = this.modalService.show(UpdateCurrencyComponent, config);
      this.bsModalRef.content.updateModel.subscribe((m: any) => {
        this.appService.updateCurrencyRate(m).subscribe({
          next: (res: any) => {
            if (res.statusCode == 200) {
              this.toastrService.success('Updated successfully.', 'Success');
              this.getCurrencies();              
            } else {
              this.toastrService.error('Soemthing went wrong', 'Error');
            }
          },
          error: (err) =>  {
            this.toastrService.error('Something went wrong', 'Error');
            console.log('Error', err);
          }
        });
      });
  }

  deleteCurrencyRate(action: string, data: CurrencyRateDto) {
    const model = data;
    const userAction = action;
    const config = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-lg',
    initialState: { model, userAction }
    };
      this.bsModalRef = this.modalService.show(DeleteCurrencyComponent, config);
      this.bsModalRef.content.updateModel.subscribe((m: any) => {
        this.appService.deleteCurrencyRate(m.id).subscribe({
          next: (res: any) => {
            if (res.statusCode == 200) {
              this.toastrService.success('Deleted successfully.', 'Success');
              this.getCurrencies();
            } else {
              this.toastrService.error('Soemthing went wrong', 'Error');
            }
          },
          error: (err) => {
            this.toastrService.error('Something went wrong', 'Error');
            console.log('Error', err);
          }
        });
      });
  }

  resetForm() {
    this.form.reset();
  }
}
