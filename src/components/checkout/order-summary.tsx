import { formatAmount } from "@/lib/checkout/format";
import type { CheckoutCustomer, DemoOrder } from "@/lib/checkout/types";

type OrderSummaryProps = {
  order: DemoOrder;
  customer: CheckoutCustomer;
};

export function OrderSummary({ order, customer }: OrderSummaryProps) {
  return (
    <aside className="space-y-6 rounded-[28px] bg-slate-950 p-6 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Order summary</p>
        <h1 className="text-3xl font-semibold">Flow sandbox demo</h1>
        <p className="text-sm leading-6 text-slate-300">
          A production-style Next.js integration that creates the payment session on the backend and
          mounts Checkout Flow on the frontend.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Customer</p>
        <p className="mt-3 text-lg font-medium">{customer.name}</p>
        <p className="text-sm text-slate-300">{customer.email}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        {order.items.map((item) => (
          <div className="flex items-center gap-4" key={item.reference ?? item.name}>
            {/* Replace sample product imagery in src/lib/checkout/sample-data.ts with your own storefront assets. */}
            <div
              aria-hidden="true"
              className="h-16 w-16 rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: item.image_url ? `url(${item.image_url})` : undefined }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{item.name}</p>
              <p className="text-sm text-slate-300">
                Qty {item.quantity} · {item.reference ?? "Demo SKU"}
              </p>
            </div>
            <p className="font-medium text-white">{formatAmount(item.total_amount, order.currency)}</p>
          </div>
        ))}
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-slate-300">
          <dt>Reference</dt>
          <dd>{order.reference}</dd>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <dt>Billing country</dt>
          <dd>{order.billingCountry}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-medium text-white">
          <dt>Total</dt>
          <dd>{formatAmount(order.amount, order.currency)}</dd>
        </div>
      </dl>
    </aside>
  );
}
