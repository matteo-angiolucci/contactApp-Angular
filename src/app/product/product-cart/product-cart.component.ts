import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from 'app/services/productServices/cart.service';
import { SingleProductLineComponent } from "./single-product-line/single-product-line.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule, SingleProductLineComponent, TranslatePipe],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.less'
})
export class ProductCartComponent {



  constructor(public cartService: CartService ){

  }



}
