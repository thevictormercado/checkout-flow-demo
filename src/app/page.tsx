import { FlowPaymentForm } from "@/components/checkout/flow-payment-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { SecureContextBanner } from "@/components/checkout/secure-context-banner";
import { TestCardPanel } from "@/components/checkout/test-card-panel";
import { getCheckoutPublicConfig, getCheckoutServerEnv } from "@/lib/checkout/env";
import { buildSamplePaymentSessionPayload, sampleCustomer, sampleOrder } from "@/lib/checkout/sample-data";

export default function Home() {
  const { publicKey } = getCheckoutPublicConfig();
  const { displayName, successUrl, failureUrl, processingChannelId } = getCheckoutServerEnv();
  const initialPayload = buildSamplePaymentSessionPayload({
    displayName,
    successUrl,
    failureUrl,
    processingChannelId,
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_32%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_52%,_#eef2ff_100%)] px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <OrderSummary customer={sampleCustomer} order={sampleOrder} />
        <div className="space-y-8">
          <SecureContextBanner />
          <FlowPaymentForm
            customer={sampleCustomer}
            initialPayload={initialPayload}
            order={sampleOrder}
            publicKey={publicKey}
          />
          <TestCardPanel />
        </div>
      </div>
    </main>
  );
}
