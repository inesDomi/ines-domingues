import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GeneratorService } from '../services/generator.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {
  public code$: Observable<string>;
  public matrix$: Observable<string[][]>;

  public character: string;
  public characterSubject: Subject<[string]> = new Subject<[string]>();


  constructor(private generatorService: GeneratorService) {
    this.characterSubject
      .pipe(
        distinctUntilChanged(),
        debounceTime(4000),
      )
      .subscribe(([value]) => {
        this.character = value;
        const sizeCols = ((this.generatorService.ROWS * this.generatorService.PERCENTAGE_COLS) / 100);
        this.generatorService.generatorMatrix(sizeCols, this.character);
      });
  }

  ngOnInit() {
    this.code$ = this.generatorService.code$;
    this.matrix$ = this.generatorService.matrix$;
  }

  public generatorMatrix = (): void => {
    this.generatorService.generatorMatrix();
  }

  public onChangeCharacter = (event: any): void => {
    const character = event.target.value;
    const pattern = /^[a-z]*$/;

    if (pattern.test(character)) {
      this.characterSubject.next(character);
    } else {
      this.character = null;
    }
  }
}
