import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CartItem } from '@dm/cartItem.model';
import { CartService } from 'app/services/productServices/cart.service';

@Component({
  selector: 'app-single-product-line',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './single-product-line.component.html',
  styleUrl: './single-product-line.component.less'
})
export class SingleProductLineComponent {

  @Input({required: true}) cartItem!: CartItem;

  constructor(private cartService : CartService){

  }

  removeItem(){
    this.cartService.removeItemFromCart(this.cartItem)
  }
}
