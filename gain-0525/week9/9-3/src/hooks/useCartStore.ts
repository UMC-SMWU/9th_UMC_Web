import { create } from "zustand";
import type { CartItems } from "../types/cart";
import { immer } from "zustand/middleware/immer";
import cartItems from "../constants/cartItems";
import { useShallow } from "zustand/shallow";

interface CartActions {
    increase: (id: string) => void;
    decrease: (id: string) => void;
    removeItem: (id:string) => void;
    clearCart: () => void;
    calculateTotals: () => void;
}

interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;

    actions: CartActions;

}

export const useCartStore = create<CartState>()(
    /* eslint-disable @typescript-eslint/no-unused-vars */
  immer((set, _) => ({
    cartItems: cartItems,
    amount: 0,
    total: 0,
    actions: {
      // 수량 증가
      increase: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);
          if (cartItem) {
            cartItem.amount += 1;
          } 
        });
      },
      // 수량 감소 (amount가 1이면 삭제)
      decrease: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);

          if (cartItem && cartItem.amount > 0) {
            cartItem.amount -= 1;
          } 
        });
      },
      // 특정 아이템 제거
      removeItem: (id: string) => {
        set((state) => {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        });
      },

      // 장바구니 비우기
      clearCart: () => {
        set((state) => {
          state.cartItems = [];
        });
      },
      // 총합 계산 (가격이 있는 경우)
      calculateTotals: () => {
        set((state) => {
            let amount = 0;
            let total = 0;

            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            })

            state.amount = amount;
            state.total = total;
        })
      },
    },
  }))
);

export const useCartInfo = () => 
    useCartStore(
        useShallow((state) => ({
            cartItems: state.cartItems,
            amount: state.amount,
            total: state.total,
        }))
    );

    export const useCartActions = () => useCartStore((state) => state.actions);