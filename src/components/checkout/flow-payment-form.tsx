"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useRouter } from "next/navigation";
import {
  loadCheckoutWebComponents,
  type CheckoutError,
  type CheckoutRequestError,
  type Component,
  type PaymentSessionResponse,
} from "@checkout.com/checkout-web-components";

import { formatAmount } from "@/lib/checkout/format";
import type { CheckoutCustomer, CreatePaymentSessionPayload, DemoOrder } from "@/lib/checkout/types";

type FlowPaymentFormProps = {
  order: DemoOrder;
  customer: CheckoutCustomer;
  initialPayload: CreatePaymentSessionPayload;
  publicKey: string;
};

type FlowStatus = "idle" | "loading" | "ready" | "error";
type FlowAlert = {
  title: string;
  message: string;
};

export function FlowPaymentForm({
  order,
  customer,
  initialPayload,
  publicKey,
}: FlowPaymentFormProps) {
  const router = useRouter();
  const flowRef = useRef<Component | null>(null);
  const [status, setStatus] = useState<FlowStatus>("idle");
  const [alert, setAlert] = useState<FlowAlert | null>(null);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void initializeFlow({
      payload: initialPayload,
      publicKey,
      router,
      setStatus,
      setAlert,
      setPaymentSessionId,
      flowRef,
      isCancelled: () => cancelled,
    });

    return () => {
      cancelled = true;
      flowRef.current?.unmount();
      flowRef.current = null;
    };
  }, [initialPayload, publicKey, router]);

  async function handleRetry() {
    try {
      await initializeFlow({
        payload: initialPayload,
        publicKey,
        router,
        setStatus,
        setAlert,
        setPaymentSessionId,
        flowRef,
        isCancelled: () => false,
      });
    } catch {
      // The initialization helper already updates component state with a customer-facing error.
    }
  }

  return (
    <section className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Secure payment
        </p>
        <h2 className="text-2xl font-semibold text-slate-950">Checkout Flow</h2>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          This demo creates a payment session on the server, then mounts Checkout Flow using your
          sandbox public key. Secrets stay on the server.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <p className="font-medium text-slate-900">Customer</p>
          <p>{customer.name}</p>
          <p>{customer.email}</p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Order</p>
          <p>{order.reference}</p>
          <p>{formatAmount(order.amount, order.currency)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Flow mount target</p>
            <p className="text-xs text-slate-500">Mounted into the required `#flow-container` node.</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === "ready"
                ? "bg-emerald-100 text-emerald-700"
                : status === "loading"
                  ? "bg-amber-100 text-amber-800"
                  : status === "error"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-200 text-slate-700"
            }`}
          >
            {status === "ready"
              ? "Ready"
              : status === "loading"
                ? "Loading"
                : status === "error"
                  ? "Needs attention"
                  : "Idle"}
          </span>
        </div>

        {paymentSessionId ? (
          <p className="mb-4 text-xs text-slate-500">Payment session: {paymentSessionId}</p>
        ) : null}

        {status === "loading" ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Creating your sandbox payment session and loading Flow…
          </div>
        ) : null}

        {alert ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-medium">{alert.title}</p>
            <p className="mt-1">{alert.message}</p>
          </div>
        ) : null}

        <div id="flow-container" className="min-h-64 rounded-2xl bg-white p-3" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={status === "loading"}
          onClick={handleRetry}
          type="button"
        >
          Recreate payment session
        </button>
        <button
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          onClick={() => router.push("/failure")}
          type="button"
        >
          Open failure page
        </button>
      </div>
    </section>
  );
}

async function createPaymentSession(payload: CreatePaymentSessionPayload) {
  const response = await fetch("/api/create-payment-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as PaymentSessionResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.message ?? "Unable to create a payment session.");
  }

  return data;
}

function readPaymentSessionId(paymentSession: PaymentSessionResponse) {
  const id = paymentSession.id;
  return typeof id === "string" ? id : null;
}

async function initializeFlow({
  payload,
  publicKey,
  router,
  setStatus,
  setAlert,
  setPaymentSessionId,
  flowRef,
  isCancelled,
}: {
  payload: CreatePaymentSessionPayload;
  publicKey: string;
  router: ReturnType<typeof useRouter>;
  setStatus: (status: FlowStatus) => void;
  setAlert: (alert: FlowAlert | null) => void;
  setPaymentSessionId: (paymentSessionId: string | null) => void;
  flowRef: MutableRefObject<Component | null>;
  isCancelled: () => boolean;
}) {
  setStatus("loading");
  setAlert(null);
  setPaymentSessionId(null);

  const container = document.querySelector("#flow-container");

  if (!container) {
    throw new Error("Unable to find #flow-container.");
  }

  flowRef.current?.unmount();
  flowRef.current = null;
  container.innerHTML = "";

  try {
    const paymentSession = await createPaymentSession(payload);

    if (isCancelled()) {
      return;
    }

    setPaymentSessionId(readPaymentSessionId(paymentSession));

    const checkout = await loadCheckoutWebComponents({
      paymentSession,
      publicKey,
      environment: "sandbox",
    });

    if (isCancelled()) {
      return;
    }

    flowRef.current = checkout.create("flow", {
      onPaymentCompleted(_component, payment) {
        router.push(`/success?payment_id=${encodeURIComponent(payment.id)}`);
      },
      onError(_component, error) {
        setAlert(getCheckoutAlert(error));
        setStatus("error");
      },
    });

    flowRef.current.mount("#flow-container");
    setStatus("ready");
  } catch (error) {
    if (isCancelled()) {
      return;
    }

    const message =
      error instanceof Error ? error.message : "Something went wrong while loading Checkout Flow.";

    setAlert({
      title: "Unable to load Checkout Flow",
      message,
    });
    setStatus("error");
    throw error;
  }
}

function getCheckoutAlert(error: CheckoutError): FlowAlert {
  if (error.type === "Submit" && error.code === "component_invalid") {
    return {
      title: "Payment details are incomplete",
      message:
        "Flow is loaded, but one or more required payment fields are still incomplete. Finish the required payment details and try again.",
    };
  }

  if (error.type === "Request") {
    const requestError = error as CheckoutRequestError;
    const codes = requestError.details.requestErrorCodes?.join(", ");
    const requestId = requestError.details.requestId;
    const status = requestError.details.status;
    const paymentId = requestError.details.paymentId;

    const extraDetails = [status ? `status ${status}` : null, codes ? `codes: ${codes}` : null, requestId ? `request_id: ${requestId}` : null, paymentId ? `payment_id: ${paymentId}` : null]
      .filter(Boolean)
      .join(" · ");

    return {
      title: "Checkout Flow payment request failed",
      message: extraDetails
        ? `${error.message}. ${extraDetails}`
        : `${error.type}: ${error.code}. ${error.message}`,
    };
  }

  return {
    title: "Checkout Flow returned an error",
    message: `${error.type}: ${error.code}. ${error.message}`,
  };
}
