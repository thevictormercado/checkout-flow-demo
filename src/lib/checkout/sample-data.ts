import type { CheckoutCustomer, CreatePaymentSessionPayload, DemoOrder } from "@/lib/checkout/types";

export const sampleOrder: DemoOrder = {
  id: "order_demo_240312_001",
  amount: 2599,
  currency: "USD",
  reference: "VIX-ORDER-240312-001",
  displayName: "VixTest",
  billingCountry: "US",
  items: [
    {
      name: "VixTest Trail Running Shoes",
      quantity: 1,
      unit_price: 2599,
      total_amount: 2599,
      reference: "SKU-TRAIL-001",
      image_url:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
    },
  ],
};

export const sampleCustomer: CheckoutCustomer = {
  name: "Jordan Smith",
  email: "jordan.smith@example.com",
};

export function buildSamplePaymentSessionPayload(config: {
  displayName: string;
  successUrl: string;
  failureUrl: string;
  processingChannelId?: string;
}): CreatePaymentSessionPayload {
  return {
    amount: sampleOrder.amount,
    currency: sampleOrder.currency,
    reference: sampleOrder.reference,
    display_name: config.displayName,
    processing_channel_id: config.processingChannelId || undefined,
    billing: {
      address: {
        country: sampleOrder.billingCountry,
      },
    },
    customer: sampleCustomer,
    success_url: config.successUrl,
    failure_url: config.failureUrl,
    items: sampleOrder.items,
    metadata: {
      order_id: sampleOrder.id,
      integration: "checkout-flow-demo",
      environment: "sandbox",
    },
  };
}
