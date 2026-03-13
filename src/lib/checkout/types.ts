export type CheckoutAddress = {
  country: string;
};

export type CheckoutBilling = {
  address: CheckoutAddress;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
};

export type CheckoutOrderItem = {
  name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  reference?: string;
  image_url?: string;
};

export type CreatePaymentSessionPayload = {
  amount: number;
  currency: string;
  reference: string;
  display_name: string;
  processing_channel_id?: string;
  billing: CheckoutBilling;
  customer: CheckoutCustomer;
  success_url: string;
  failure_url: string;
  items?: CheckoutOrderItem[];
  metadata?: Record<string, string | number | boolean>;
};

export type CheckoutApiError = {
  request_id?: string;
  error_type?: string;
  error_codes?: string[];
};

export type PaymentSessionResponse = Record<string, unknown>;

export type DemoOrder = {
  id: string;
  amount: number;
  currency: string;
  reference: string;
  displayName: string;
  billingCountry: string;
  items: CheckoutOrderItem[];
};
