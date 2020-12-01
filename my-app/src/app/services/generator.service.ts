import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { IPayment } from '../payments/payment.interface';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class GeneratorService {
  private codeSubject = new BehaviorSubject<string>(null);
  private matrixSubject = new BehaviorSubject<string[][]>([]);
  private paymentsSubject = new BehaviorSubject<IPayment[]>([]);

  public code$: Observable<string>;
  public matrix$: Observable<string[][]>;
  public payments$: Observable<IPayment[]> = this.paymentsSubject.asObservable();

  readonly CHARACTERES = 'abcdefghijklmnopqrstuvwxyz';
  readonly COLS = 10;
  readonly ROWS = 10;
  readonly PERCENTAGE_COLS = 20;


  constructor() {
    this.code$ = this.codeSubject.asObservable();
    this.matrix$ = this.matrixSubject.asObservable();

    interval(2000).subscribe(() => {
      this.generatorMatrix();
      this.generatorCode();
    });
  }

  public get code(): string {
    return this.codeSubject.getValue();
  }

  public get matrix(): string[][] {
    return this.matrixSubject.getValue();
  }

  public get payment(): IPayment[] {
    return this.paymentsSubject.getValue();
  }

  public setPayment(payment: IPayment[]) {
    this.paymentsSubject.next(payment);
  }



  public generatorMatrix = (percentage?: number, character?: string): void => {
    let matrix: string[][] = [];

    for (let x = 0; x < this.ROWS; x++) {
      matrix[x] = [];

      for (let y = 0; y < this.COLS; y++) {
        matrix[x][y] = this.CHARACTERES[this.randomPosition(this.CHARACTERES.length)];
      }
    }

    if (percentage) {
      for (let x = 0; x < this.ROWS; x++) {
        for (let y = 0; y < percentage; y++) {
          matrix[x][y] = character;
        }
      }
      matrix = this.shuffle(matrix);
    }

    this.matrixSubject.next(matrix);
  }

  public generatorCode = (): void => {
    const currentDate = new Date();
    const seconds = currentDate.getSeconds().toString();
    const zeroPad = seconds.padStart(2, '0');
    const arraySeconds = Array.from((zeroPad), Number);

    const characterFirstPosition = this.matrix[arraySeconds[0]][arraySeconds[1]];
    const characterSecondPosition = this.matrix[arraySeconds[1]][arraySeconds[0]];

    let accFirstCharacter = 0;
    let accSecondCharacter = 0;

    for (let x = 0; x < this.ROWS; x++) {
      for (let y = 0; y < this.COLS; y++) {
        const characterRandomPosition = this.matrix[x][y];
        if (characterRandomPosition === characterFirstPosition) {
          accFirstCharacter++;
        } else if (characterRandomPosition === characterSecondPosition) {
          accSecondCharacter++;
        }
      }
    }

    const firstDigit = (accFirstCharacter > 9) ? this.singleDigitSum(accFirstCharacter) : accFirstCharacter;
    const secondDigit = (accSecondCharacter > 9) ? this.singleDigitSum(accSecondCharacter) : accSecondCharacter;

    this.codeSubject.next(`${firstDigit}${secondDigit}`);
  }


  private singleDigitSum = (acc: number): number => {
    let sum = acc % 9;
    while (sum === 0) {
      sum += 9;
    }
    return Number(sum.toFixed());
  }

  private shuffle = (matrix: string[][]): string[][] => {
    for (let x = 0; x < this.ROWS; x++) {
      for (let y = 0; y < this.COLS; y++) {
        const randomX = this.randomPosition(this.ROWS);
        const randomY = this.randomPosition(this.COLS);

        const temp = matrix[x][y];
        matrix[x][y] = matrix[randomX][randomY];
        matrix[randomX][randomY] = temp;
      }
    }
    return matrix;
  }

  private randomPosition(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
