"use client";

import { useEffect, useState } from "react";

type PaymentDetailsPanelProps = {
  paymentId?: string;
  sessionId?: string;
};

type LookupState = {
  status: "idle" | "loading" | "ready" | "error";
  data: Record<string, unknown> | null;
  error: string | null;
};

export function PaymentDetailsPanel({ paymentId, sessionId }: PaymentDetailsPanelProps) {
  const [paymentLookup, setPaymentLookup] = useState<LookupState>({
    status: paymentId ? "loading" : "idle",
    data: null,
    error: null,
  });
  const [sessionLookup, setSessionLookup] = useState<LookupState>({
    status: sessionId ? "loading" : "idle",
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!paymentId) {
      return;
    }

    let cancelled = false;

    void fetchPaymentDetails(paymentId)
      .then((data) => {
        if (cancelled) {
          return;
        }

        setPaymentLookup({
          status: "ready",
          data,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setPaymentLookup({
          status: "error",
          data: null,
          error: error instanceof Error ? error.message : "Unable to fetch payment details.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    void fetchPaymentDetails(sessionId)
      .then((data) => {
        if (cancelled) {
          return;
        }

        setSessionLookup({
          status: "ready",
          data,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setSessionLookup({
          status: "error",
          data: null,
          error: error instanceof Error ? error.message : "Unable to fetch session details.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <section className="mt-8 space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Backend lookups
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Fetched payment details</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These calls go through your server route and use the Checkout.com secret key safely on the
          backend.
        </p>
      </div>

      <LookupCard
        title="Payment lookup"
        identifier={paymentId}
        optional={false}
        state={paymentLookup}
      />
      <LookupCard title="Session lookup" identifier={sessionId} optional state={sessionLookup} />
    </section>
  );
}

function LookupCard({
  title,
  identifier,
  optional,
  state,
}: {
  title: string;
  identifier?: string;
  optional: boolean;
  state: LookupState;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <span className="text-xs text-slate-500">{optional ? "Optional" : "Primary"}</span>
      </div>

      <p className="mt-2 break-all text-sm text-slate-700">
        <span className="font-medium text-slate-900">Identifier:</span> {identifier ?? "Not provided"}
      </p>

      {!identifier ? (
        <p className="mt-3 text-sm text-slate-600">
          {optional
            ? "No session identifier was returned. This is normal for non-redirect card payments."
            : "A payment identifier is required to confirm a successful payment."}
        </p>
      ) : null}

      {identifier && state.status === "loading" ? (
        <p className="mt-3 text-sm text-slate-600">Fetching Checkout.com details…</p>
      ) : null}

      {identifier && state.status === "error" ? (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {state.error}
        </div>
      ) : null}

      {identifier && state.status === "ready" ? (
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
          {JSON.stringify(state.data, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

async function fetchPaymentDetails(id: string) {
  const response = await fetch(`/api/payments/${encodeURIComponent(id)}`, {
    method: "GET",
  });

  const data = (await response.json()) as Record<string, unknown> & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.message ?? "Unable to fetch Checkout.com payment details.");
  }

  return data;
}
