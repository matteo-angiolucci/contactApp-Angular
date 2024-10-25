import { Injectable } from '@angular/core';
import { ICategory } from '@dm/category.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private selectedCategorySubject = new BehaviorSubject<number | null>(null);
  selectedCategory$ = this.selectedCategorySubject.asObservable();


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


  setSelectedCategory(id : number | null){
    this.selectedCategorySubject.next(id);
  }

}
