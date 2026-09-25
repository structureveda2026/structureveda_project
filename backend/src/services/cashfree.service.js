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
// Single centralized gateway instance used for all booking types (Consultations and Rituals).
// ---------------------------------------------------------------------------
const CASHFREE_API_VERSION = "2023-08-01";

const cashfree = new Cashfree(CFEnvironment.SANDBOX, CASHFREE_API_VERSION);
cashfree.XClientId = appId;
cashfree.XClientSecret = secretKey;

// ---------------------------------------------------------------------------
// createCashfreeOrder
//
// Creates a Cashfree Sandbox payment order.
// Accepts normalized booking details, maintaining backward compatibility with
// legacy consultation parameters while supporting generalized ritual payments.
//
// Parameters:
//   orderId         {string}       Unique order identifier (e.g. "VB-123456" or "VEDA-PUJA-XXXXXXXX")
//   amount          {number}       Authoritative amount (takes precedence if provided)
//   orderAmount     {number}       Legacy authoritative amount parameter
//   customerDetails {object}       Normalized customer details { name, phone, normalizedPhone, email }
//   customerPhone   {string}       Legacy customer phone string
//   customerName    {string}       Legacy customer full name string
//   customerEmail   {string|null}  Legacy customer email string
//   customerId      {string}       Optional customer ID (defaults to orderId)
//   returnUrl       {string}       Dynamic redirect URL post-payment
//   orderNote       {string}       Dynamic note describing order contents
//
// Returns:
//   { cfOrderId, paymentSessionId, orderStatus, orderAmount }
//
// Throws on:
//   - Missing credentials
//   - Invalid orderId or amount
//   - Cashfree API error (network or non-2xx)
//   - Missing paymentSessionId in response
// ---------------------------------------------------------------------------
export const createCashfreeOrder = async ({
  orderId,
  orderAmount,
  amount,
  customerDetails,
  customerPhone,
  customerName,
  customerEmail,
  customerId,
  returnUrl,
  orderNote,
}) => {
  if (!appId || !secretKey) {
    throw new Error(
      "Cashfree credentials are not configured. Payment order cannot be created.",
    );
  }

  if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
    throw new Error("Order ID is required to create a Cashfree payment order.");
  }

  const effectiveOrderId = orderId.trim();

  // 1. Authoritative Amount (prefer 'amount', fallback to legacy 'orderAmount')
  const rawAmount = amount !== undefined ? amount : orderAmount;
  const finalAmount = Number(Number(rawAmount).toFixed(2));

  if (isNaN(finalAmount) || finalAmount <= 0) {
    throw new Error(
      `Invalid payment amount: ${rawAmount}. Amount must be a positive number.`,
    );
  }

  // 2. Normalized Customer Details
  const resolvedName =
    customerDetails?.name?.trim() || customerName?.trim() || "Valued Devotee";

  const rawPhone =
    customerDetails?.normalizedPhone ||
    customerDetails?.phone ||
    customerPhone ||
    "";
  const sanitizedPhone = String(rawPhone).replace(/\D/g, "").slice(-10);

  if (!sanitizedPhone || sanitizedPhone.length < 10) {
    throw new Error(
      "A valid 10-digit customer phone number is required by Cashfree.",
    );
  }

  const resolvedEmail =
    customerDetails?.email?.trim() ||
    customerEmail?.trim() ||
    "noreply@vedastructure.com";

  const resolvedCustomerId =
    customerId || customerDetails?.id || effectiveOrderId;

  // 3. Dynamic Return URL & Order Note with safe consultation fallbacks
  const defaultReturnUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/astrologers/vishal-bhardwaj/booking-status?order_id={order_id}`;
  const effectiveReturnUrl = returnUrl || defaultReturnUrl;

  const defaultOrderNote = `Astrologer consultation booking - ${effectiveOrderId}`;
  const effectiveOrderNote = orderNote || defaultOrderNote;

  const notifyUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payments/webhook`;

  const orderRequest = {
    order_id: effectiveOrderId,
    order_amount: finalAmount,
    order_currency: "INR",
    customer_details: {
      customer_id: resolvedCustomerId,
      customer_name: resolvedName,
      customer_email: resolvedEmail,
      customer_phone: sanitizedPhone,
    },
    order_meta: {
      return_url: effectiveReturnUrl,
      notify_url: notifyUrl,
    },
    order_note: effectiveOrderNote,
  };

  // cashfree-pg v6: PGCreateOrder takes the order request object.
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
    paymentSessionId: payment_session_id,  // Required by Cashfree.js frontend SDK
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

// ---------------------------------------------------------------------------
// Expose underlying Cashfree instance for testing and health verification
// ---------------------------------------------------------------------------
export const getCashfreeInstance = () => cashfree;

export default {
  createCashfreeOrder,
  fetchCashfreeOrder,
  fetchCashfreeOrderPayments,
  verifyCashfreeWebhookSignature,
  getCashfreeInstance,
};
