import Link from "next/link";

export default async function FailurePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const sessionId = firstValue(params["cko-session-id"]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-[32px] border border-rose-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">Failure</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Payment was not completed</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Use this page as the Checkout.com `failure_url` target. It gives you a clean place to
          explain the retry path, log identifiers, and route customers back into the checkout flow.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
          <p>
            <span className="font-medium text-slate-900">cko-session-id:</span>{" "}
            {sessionId ?? "Not provided"}
          </p>
        </div>

        <div className="mt-8">
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            href="/"
          >
            Return to checkout
          </Link>
        </div>
      </section>
    </main>
  );
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
