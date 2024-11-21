import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '@dm/product.model';
import { CartService } from 'app/services/productServices/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.less',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  constructor(public cartService: CartService) {}


  addProductToCart() {
    this.cartService.addToCart(this.product);
  }

  decreaseProductFromCart() {
    this.cartService.removeFromCart(this.product);
  }
}
