import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-currency',
  templateUrl: './delete-currency.component.html',
  styleUrls: ['./delete-currency.component.scss']
})
export class DeleteCurrencyComponent implements OnInit {

  form: FormGroup;
  model: any;
  userAction?: string;  

  @Output() updateModel = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
      private bsModelRef: BsModalRef) {}

  ngOnInit(): void {
    this.getForm();
    this.form.setValue({
      id: this.model.id
    });
  }

  getForm(): any {
    this.form = this.fb.group({
      id: this.model.id      
    });
  }


  onSubmit(): void {
    this.updateModel.emit(this.form.value)
    this.bsModelRef.hide();
  }

  closeModal(): void {
    this.bsModelRef.hide();
  }

}
