import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneratorService } from '../services/generator.service';
import { IPayment } from './payment.interface';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  public code$: Observable<string>;
  public payments$: Observable<IPayment[]>;
  public model = {} as IPayment;

  constructor(private generatorService: GeneratorService) {}

  ngOnInit() {
    this.code$ = this.generatorService.code$;
    this.payments$ = this.generatorService.payments$;
  }

  public onSubmit(): void {
    const payment: IPayment = {
      payment: this.model.payment,
      ammount: this.model.ammount,
      code: this.generatorService.code,
      matrix: this.generatorService.matrix
    };

    const payments: IPayment[] = [...this.generatorService.payment, payment];

    this.generatorService.setPayment(payments);
  }

}
