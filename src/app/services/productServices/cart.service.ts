
import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '@dm/cartItem.model';
import { Product } from '@dm/product.model';



@Injectable({
  providedIn: 'root'
})
export class CartService {

  // lets use a SIGNAL TO STORE OUR CART ITEMS

   freeDeliveryAmount = 35;

  cartItems = signal<CartItem[]>([])

  // Reactive signal to compute quantity based on the cart state
  cartQuantity = computed(() =>
    this.cartItems().length
  );

  subTotal = computed(() =>
    this.cartItems().reduce(
      (subTotal, item) => subTotal + item.product.price * item.quantity,
      0
    )
  );

  deliveryFee = computed(() => (this.subTotal() < this.freeDeliveryAmount ? 5.99 : 0));

  tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);

  totalPrice = computed(
    () => this.subTotal() + this.deliveryFee() + this.tax()
  );



// Check if a product is already in the cart
getCartItem(productId: number) {
  return this.cartItems().find(cartItem => cartItem.product.id === productId);
}


// Adds a product to the cart or increments its quantity if already in the cart
addToCart(product: Product): void {
  const existingItemIndex = this.cartItems().findIndex(
    (item) => item.product.id === product.id
  );

  if (existingItemIndex > -1) {
    // Update the quantity for the existing item
    const updatedItems = [...this.cartItems()];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + 1,
    };
    this.cartItems.set(updatedItems); // Trigger signal update
  } else {
    // Add new item to the cart with quantity 1
    this.cartItems.set([...this.cartItems(), { product, quantity: 1 }]);
  }
}

// Decrements the quantity of a product in the cart or removes it if quantity reaches zero
removeFromCart(product: Product): void {
  const existingItemIndex = this.cartItems().findIndex(
    (item) => item.product.id === product.id
  );

  if (existingItemIndex > -1) {
    const updatedItems = [...this.cartItems()];
    const existingItem = updatedItems[existingItemIndex];

    if (existingItem.quantity > 1) {
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
    } else {
      // Remove the item if quantity reaches 0
      updatedItems.splice(existingItemIndex, 1);
    }

    this.cartItems.set(updatedItems); // Trigger signal update
  }
}

removeItemFromCart(cartItem : CartItem){
  this.cartItems.update((items) => items.filter(item => item.product.id !== cartItem.product.id));

}


// Method to get the quantity of a product in the cart
getProductQuantity(productId: number): number {
  const cartItem = this.getCartItem(productId);
  return cartItem ? cartItem.quantity : 0;
}



}
