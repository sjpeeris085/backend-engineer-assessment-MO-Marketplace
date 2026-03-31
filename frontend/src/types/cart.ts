export interface CheckoutItemPayload {
  productId: string | number;
  quantity: number;
}

export interface CheckoutPayload {
  items: CheckoutItemPayload[];
  recipientName: string;
  recipientPhone: string;
  recipientAddressLine1: string;
  recipientAddressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}
