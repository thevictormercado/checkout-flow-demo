"use client";

type BannerState = {
  showBanner: boolean;
  origin: string;
};

export function SecureContextBanner() {
  const { showBanner, origin } = getBannerState();

  if (!showBanner) {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
        Secure context warning
      </p>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">Browser payment autofill is limited here</h2>
      <p className="mt-2 leading-6">
        You are viewing the checkout from <span className="font-mono">{origin}</span>, which is not
        treated as a secure origin for browser payment autofill. Manual entry still works, but card
        autofill may be disabled.
      </p>
      <p className="mt-3 leading-6">
        Use <span className="font-mono">http://localhost:3000</span> for local testing, or serve the
        app over HTTPS.
      </p>
    </section>
  );
}

function getBannerState(): BannerState {
  if (typeof window === "undefined") {
    return {
      showBanner: false,
      origin: "",
    };
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const isSecure = window.isSecureContext || protocol === "https:";

  return {
    origin: window.location.origin,
    showBanner: !isSecure && !isLocalhost,
  };
}
