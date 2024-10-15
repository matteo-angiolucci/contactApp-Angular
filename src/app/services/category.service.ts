import { Injectable } from '@angular/core';
import { ICategory } from '@dm/category.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: ICategory[] = [
    { id: 1, name: 'Home' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'CellPhone'}
  ];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  getCategories() : Observable<ICategory[]>{
   return of(this.categories)
  }


}
