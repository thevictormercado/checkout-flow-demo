import Link from "next/link";

import { PaymentDetailsPanel } from "@/components/checkout/payment-details-panel";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const paymentId = firstValue(params.payment_id);
  const sessionId = firstValue(params["cko-session-id"]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <section className="w-full rounded-[32px] border border-emerald-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Success</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Payment confirmed</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Your primary confirmation value is the Checkout.com <span className="font-mono">payment_id</span>.
          A <span className="font-mono">cko-session-id</span> is optional and usually appears only for
          redirect-based flows such as 3DS or external payment method handoffs.
        </p>

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Primary confirmation
          </p>
          <p className="mt-3 break-all font-mono text-base">{paymentId ?? "Not provided"}</p>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <p className="font-medium text-slate-900">payment_id</p>
            <p className="mt-1 break-all">{paymentId ?? "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">cko-session-id</p>
            <p className="mt-1 break-all">{sessionId ?? "Not provided"}</p>
            <p className="mt-2 text-xs text-slate-500">
              Optional. It may be absent for straight-through card payments.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            href="/"
          >
            Back to checkout
          </Link>
        </div>
      </section>

      <PaymentDetailsPanel paymentId={paymentId} sessionId={sessionId} />
    </main>
  );
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
