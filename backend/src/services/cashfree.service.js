import { Cashfree, CFEnvironment } from "cashfree-pg";
import dotenv from "dotenv";

dotenv.config();

// ---------------------------------------------------------------------------
// Validate that Cashfree credentials are present in the environment.
// Fail loudly at startup rather than silently at runtime.
// ---------------------------------------------------------------------------
const appId = process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_SECRET_KEY;

if (!appId || !secretKey) {
  console.warn(
    "⚠️  CASHFREE_APP_ID or CASHFREE_SECRET_KEY is missing. Payment features will be unavailable.",
  );
}

// ---------------------------------------------------------------------------
// Configure the Cashfree SDK instance (v6 API pattern).
//
// cashfree-pg v6 uses an instance-based API:
//   new Cashfree(CFEnvironment.SANDBOX, apiVersion)
//
// Credentials are set as instance properties after construction.
// The API version is pinned here — bump only after testing against the new spec.
// ---------------------------------------------------------------------------
const CASHFREE_API_VERSION = "2023-08-01";

const cashfree = new Cashfree(CFEnvironment.SANDBOX, CASHFREE_API_VERSION);
cashfree.XClientId = appId;
cashfree.XClientSecret = secretKey;

// ---------------------------------------------------------------------------
// createCashfreeOrder
//
// Creates a Cashfree Sandbox payment order.
// Called ONLY from payment.controller.js after booking validation.
//
// Parameters:
//   orderId       {string}  Unique order identifier (= bookingReference, e.g. "VB-123456")
//   orderAmount   {number}  Final INR amount — read from DB, NEVER from the client
//   customerPhone {string}  10-digit phone number (Cashfree requirement)
//   customerName  {string}  Customer full name
//   customerEmail {string|null}  Customer email (optional)
//
// Returns:
//   { cfOrderId, paymentSessionId, orderStatus, orderAmount }
//
// Throws on:
//   - Missing credentials
//   - Cashfree API error (network or non-2xx)
//   - Missing paymentSessionId in response
// ---------------------------------------------------------------------------
export const createCashfreeOrder = async ({
  orderId,
  orderAmount,
  customerPhone,
  customerName,
  customerEmail,
  customerId,
}) => {
  if (!appId || !secretKey) {
    throw new Error(
      "Cashfree credentials are not configured. Payment order cannot be created.",
    );
  }

  const orderRequest = {
    order_id: orderId,
    order_amount: Number(orderAmount),
    order_currency: "INR",
    customer_details: {
      // customer_id must be non-empty; use customerId or orderId as a stable fallback.
      customer_id: customerId || orderId,
      customer_name: customerName,
      customer_email: customerEmail || "noreply@vedastructure.com",
      customer_phone: customerPhone,
    },
    order_meta: {
      // return_url: Cashfree redirects here after payment (Phase 2B will handle this route).
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/astrologers/vishal-bhardwaj/booking-status?order_id={order_id}`,
      // notify_url: Cashfree POSTs payment status updates here (Phase 2B webhook).
      notify_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payments/webhook`,
    },
    order_note: `Astrologer consultation booking - ${orderId}`,
  };

  // cashfree-pg v6: PGCreateOrder takes only the order request object.
  // The API version was already baked into the SDK instance at construction.
  const response = await cashfree.PGCreateOrder(orderRequest);

  if (!response?.data) {
    throw new Error("Invalid or empty response received from Cashfree API.");
  }

  const { cf_order_id, payment_session_id, order_status, order_amount } =
    response.data;

  if (!payment_session_id) {
    throw new Error(
      "Cashfree did not return a payment_session_id. Order creation may have failed.",
    );
  }

  return {
    cfOrderId: cf_order_id,               // Cashfree's internal order reference
    paymentSessionId: payment_session_id,  // Required by Cashfree.js frontend SDK (Phase 2B)
    orderStatus: order_status,             // Expected: "ACTIVE" for a fresh sandbox order
    orderAmount: order_amount,             // Echoed back for frontend display
  };
};

// ---------------------------------------------------------------------------
// fetchCashfreeOrder
//
// Retrieves the real-time order details from Cashfree Sandbox.
// Parameters:
//   orderId {string}  The order identifier (= bookingReference)
// Returns:
//   The Cashfree order data object (including order_status, order_amount, cf_order_id)
// ---------------------------------------------------------------------------
export const fetchCashfreeOrder = async (orderId) => {
  if (!appId || !secretKey) {
    throw new Error(
      "Cashfree credentials are not configured. Cannot fetch order details.",
    );
  }

  const response = await cashfree.PGFetchOrder(orderId);
  if (!response?.data) {
    throw new Error("Invalid or empty response received when fetching Cashfree order.");
  }

  return response.data;
};

// ---------------------------------------------------------------------------
// fetchCashfreeOrderPayments
//
// Retrieves all payment attempts/transactions associated with an order.
// Parameters:
//   orderId {string}  The order identifier (= bookingReference)
// Returns:
//   Array of payment transaction objects (including cf_payment_id, payment_status, payment_amount)
// ---------------------------------------------------------------------------
export const fetchCashfreeOrderPayments = async (orderId) => {
  if (!appId || !secretKey) {
    throw new Error(
      "Cashfree credentials are not configured. Cannot fetch order payments.",
    );
  }

  const response = await cashfree.PGOrderFetchPayments(orderId);
  return Array.isArray(response?.data) ? response.data : [];
};

// ---------------------------------------------------------------------------
// verifyCashfreeWebhookSignature
//
// Validates the authenticity of an incoming Cashfree webhook request using
// HMAC-SHA256 signature verification via the Cashfree SDK.
// Parameters:
//   signature {string}  From x-webhook-signature header
//   rawBody   {string}  Raw unparsed request body string
//   timestamp {string}  From x-webhook-timestamp header
// Returns:
//   Verified webhook event object
// Throws on:
//   Signature mismatch or verification failure
// ---------------------------------------------------------------------------
export const verifyCashfreeWebhookSignature = ({ signature, rawBody, timestamp }) => {
  if (!signature || !timestamp || !rawBody) {
    throw new Error("Missing signature, timestamp, or raw body for webhook verification.");
  }

  return cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
};

