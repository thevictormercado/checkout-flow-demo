export function TestCardPanel() {
  return (
    <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          Sandbox testing
        </p>
        <h2 className="text-2xl font-semibold text-slate-950">Test payment details</h2>
        <p className="text-sm leading-6 text-slate-700">
          Use Checkout.com sandbox test details here. These values are for testing only and should
          never be shown in a live checkout.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-5">
        <dl className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium text-slate-900">Card number</dt>
            <dd className="font-mono text-slate-950">4242 4242 4242 4242</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium text-slate-900">Expiry date</dt>
            <dd>Any future date</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium text-slate-900">Security code</dt>
            <dd>Any valid 3-digit CVV</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium text-slate-900">Cardholder name</dt>
            <dd>Any name</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 rounded-2xl bg-white/80 p-4 text-sm leading-6 text-slate-700">
        <p className="font-medium text-slate-900">If submit says the component is invalid</p>
        <p className="mt-1">
          That means Flow is loaded, but one or more required fields are still incomplete. Check the
          selected payment method, finish all fields, and submit again.
        </p>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Reference: Checkout.com official API examples use <span className="font-mono">4242424242424242</span>{" "}
        as a sandbox card number, and Checkout support states cardholder names are not validated in
        sandbox.
      </p>
    </section>
  );
}
