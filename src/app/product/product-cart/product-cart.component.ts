import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from 'app/services/productServices/cart.service';
import { SingleProductLineComponent } from "./single-product-line/single-product-line.component";

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule, SingleProductLineComponent],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.less'
})
export class ProductCartComponent {



  constructor(public cartService: CartService ){

  }



}
