export interface OrderWithLineItems {
  id?: number;
  orderNumber: number;
  orderItems: OrderLineItemType[];
}
export type OrderLineItemType = {
  id: number;
  productId: number;
  qty: number;
};
