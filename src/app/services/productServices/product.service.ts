import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '@dm/product.model';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.PRODUCT_SERVICE_ENDPOINT;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
   }

   getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/list` , { responseType: 'json' });
  }


  loadProducts() {
    this.getProducts().subscribe((data) => {
      this.productsSubject.next(data);
    });
  }



}
