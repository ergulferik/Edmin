import { Query } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ClassState, ClassStore } from './class.store';

@Injectable({
  providedIn: 'root'
})
export class ClassQuery extends Query<ClassState> {  

  classes$ = this.select(state => state.classes);
  fields$ = this.select(state => state.fields);
  students$ = this.select(state => state.students);

  constructor(store: ClassStore) {
    super(store);
  }
}