# Checkout.com Flow Sandbox Demo

Production-style demo app for Checkout.com sandbox payments using **Checkout Flow**, built with:

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Route Handlers for backend endpoints
- Environment-variable based configuration

## What this app includes

- Checkout page with order summary and Flow mounted into `#flow-container`
- `POST /api/create-payment-session`
- `POST /api/webhooks/checkout`
- `/success` and `/failure` result pages
- Sample order and customer objects
- Robust server-side error handling around Checkout.com session creation

## Project structure

```text
src/
  app/
    api/
      create-payment-session/route.ts
      webhooks/checkout/route.ts
    failure/page.tsx
    success/page.tsx
    page.tsx
  components/
    checkout/
      flow-payment-form.tsx
      order-summary.tsx
  lib/
    checkout/
      env.ts
      format.ts
      payment-session.ts
      sample-data.ts
      types.ts
```

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then update the values in `.env.local`.

Important replacements:

- Replace `CKO_PUBLIC_KEY` with your own Checkout.com sandbox public key.
- Replace `CKO_SECRET_KEY` with your own Checkout.com sandbox secret key.
- Replace `CKO_API_PREFIX` with your own Checkout.com sandbox API prefix.
- Replace `CKO_DISPLAY_NAME` with the merchant name you want Flow to show.
- Replace `CKO_PROCESSING_CHANNEL_ID` with your Checkout.com sandbox processing channel ID if your account requires one.
- Replace `CKO_SUCCESS_URL` and `CKO_FAILURE_URL` with routes you control.

For local development, use:

```env
CKO_SUCCESS_URL=http://localhost:3000/success
CKO_FAILURE_URL=http://localhost:3000/failure
```

The exact replacement points are also called out with comments in:

- `.env.example`
- `src/lib/checkout/env.ts`

## Install and run

Use a modern Node.js version. Next.js 16 requires Node 20.9+.

```bash
nvm use
npm install
npm run dev
```

Open `http://localhost:3000`.

## How the payment flow works

1. The checkout page loads the sample order and customer from `src/lib/checkout/sample-data.ts`.
2. The client calls `POST /api/create-payment-session`.
3. The server sends the request to:
   `https://{CKO_API_PREFIX}.api.sandbox.checkout.com/payment-sessions`
4. The server returns the **unmodified** Checkout.com payment session response.
5. The client initializes `@checkout.com/checkout-web-components` with:
   - `paymentSession`
   - `CKO_PUBLIC_KEY`
   - `environment: "sandbox"`
6. Flow mounts into the `#flow-container` div.

## API routes

### `POST /api/create-payment-session`

Accepts:

- `amount`
- `currency`
- `reference`
- `display_name`
- `processing_channel_id` when your account requires it
- `billing.address.country`
- `customer.name`
- `customer.email`
- `success_url`
- `failure_url`

The demo also includes optional `items` and `metadata`.

### `POST /api/webhooks/checkout`

Logs incoming webhook payloads for testing.

Before production use:

- verify the `cko-signature` header
- use `CKO_WEBHOOK_SECRET`
- reject invalid webhook signatures

## Notes on secrets

- `CKO_SECRET_KEY` is used only on the server.
- The secret key is never exposed to the client bundle.
- `CKO_PUBLIC_KEY` is safe to expose to the browser and is passed from the server-rendered page into the Flow component.

## Sample data

Update `src/lib/checkout/sample-data.ts` to change:

- amount
- currency
- reference
- billing country
- product details
- sample customer details

## Webhook testing

You can target:

```text
http://localhost:3000/api/webhooks/checkout
```

For external webhook delivery, use a tunnel like ngrok or deploy the app.

## Commands

```bash
npm run dev
npm run lint
npm run build
```
