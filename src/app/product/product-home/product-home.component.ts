import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '@dm/product.model';
import { ProductService } from 'app/services/productServices/product.service';
import { Observable, of } from 'rxjs';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductCartComponent } from "../product-cart/product-cart.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductCartComponent, TranslatePipe],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.less'
})
export class ProductHomeComponent {

  products$ : Observable<Product[]> = of([])

  constructor(private productService : ProductService){
    this.products$ = this.productService.products$;
  }
}
