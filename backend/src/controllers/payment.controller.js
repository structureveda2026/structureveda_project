import {
  resolveBookingEntity,
  BookingResolverError,
  BOOKING_TYPES,
} from "../services/bookingResolver.service.js";
import {
  createCashfreeOrder,
  fetchCashfreeOrder,
  fetchCashfreeOrderPayments,
  verifyCashfreeWebhookSignature,
} from "../services/cashfree.service.js";

// ---------------------------------------------------------------------------
// createPaymentOrder
//
// POST /api/payments/create-order
//
// Creates or recovers a Cashfree Sandbox order for an existing Pending booking.
// Polymorphically supports both Consultation bookings and Generic Ritual bookings.
//
// Request body:
//   { bookingReference: string }
//
// Authorization:
//   - If booking has a userId, only the authenticated owner or admin can initiate payment.
//   - If booking is a guest booking (userId is null), anyone with the unguessable
//     cryptographic reference can initiate payment.
//
// Authoritative Pricing:
//   - The order amount is read strictly from the resolved database record.
//   - Client-supplied amounts are never accepted.
// ---------------------------------------------------------------------------
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingReference } = req.body;

    // 1. bookingReference is the only parameter accepted from the client
    if (!bookingReference || typeof bookingReference !== "string" || !bookingReference.trim()) {
      return res.status(400).json({
        success: false,
        message: "Booking reference is required.",
      });
    }

    const rawRef = bookingReference.trim();

    // 2. Resolve booking entity via polymorphic Booking Resolver
    let adapter;
    try {
      adapter = await resolveBookingEntity(rawRef);
    } catch (err) {
      if (err instanceof BookingResolverError && err.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Booking not found. Please check your booking reference.",
        });
      }
      throw err;
    }

    const ref = adapter.reference;

    // 3. Authorization check
    if (!adapter.canAccess(req.user)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to initiate payment for this booking.",
      });
    }

    // 4. Validate booking is eligible for payment initiation
    if (adapter.paymentStatus === "Paid" && adapter.bookingStatus === "Confirmed") {
      return res.status(200).json({
        success: true,
        alreadyPaid: true,
        message: "This booking has already been paid and confirmed. No further payment is required.",
        data: {
          bookingReference: ref,
          bookingStatus: adapter.bookingStatus,
          paymentStatus: adapter.paymentStatus,
          transactionId: adapter.transactionId,
          orderAmount: adapter.authoritativeAmount,
        },
      });
    }

    if (adapter.bookingStatus === "Cancelled") {
      return res.status(409).json({
        success: false,
        message: "This booking has been cancelled and cannot be paid.",
      });
    }

    if (adapter.bookingStatus === "Confirmed" && adapter.paymentStatus !== "Paid") {
      return res.status(409).json({
        success: false,
        message: "Booking status conflict. Please contact support.",
      });
    }

    // 5. Read the authoritative amount from the database - never from the client
    const orderAmount = adapter.authoritativeAmount;

    if (!orderAmount || orderAmount <= 0) {
      return res.status(422).json({
        success: false,
        message: "Booking has an invalid amount. Please contact support.",
      });
    }

    // 6. Check if an existing Cashfree order can be recovered or reused
    let existingOrder = null;
    const existingOrderCandidate =
      adapter.transactionId && adapter.transactionId.startsWith(ref)
        ? adapter.transactionId
        : ref;

    try {
      existingOrder = await fetchCashfreeOrder(existingOrderCandidate);
    } catch {
      // If candidate failed and was different from ref, try base ref
      if (existingOrderCandidate !== ref) {
        try {
          existingOrder = await fetchCashfreeOrder(ref);
        } catch {
          existingOrder = null;
        }
      }
    }

    if (existingOrder) {
      const orderStatusUpper = existingOrder.order_status?.toUpperCase();

      // Case A: Existing order was already PAID on Cashfree
      if (orderStatusUpper === "PAID") {
        const trustedAmount = adapter.authoritativeAmount;
        const cfAmount = Number(existingOrder.order_amount);

        if (Math.abs(trustedAmount - cfAmount) <= 0.01) {
          let cfPaymentId = existingOrder.cf_order_id;
          let paymentGroup = null;

          try {
            const payments = await fetchCashfreeOrderPayments(existingOrder.order_id);
            const successPayment =
              payments.find((p) => p.payment_status?.toUpperCase() === "SUCCESS") || payments[0];
            if (successPayment?.cf_payment_id) cfPaymentId = successPayment.cf_payment_id;
            if (successPayment?.payment_group) paymentGroup = successPayment.payment_group;
          } catch {
            // fallback to cf_order_id
          }

          await adapter.markConfirmed(cfPaymentId, paymentGroup);

          return res.status(200).json({
            success: true,
            alreadyPaid: true,
            message: "Payment for this booking was already completed and verified.",
            data: {
              bookingReference: ref,
              bookingStatus: adapter.bookingStatus,
              paymentStatus: adapter.paymentStatus,
              transactionId: String(cfPaymentId),
              orderAmount: adapter.authoritativeAmount,
            },
          });
        }
      }

      // Case B: Existing order is still ACTIVE and has a valid payment_session_id
      if (orderStatusUpper === "ACTIVE" && existingOrder.payment_session_id) {
        return res.status(200).json({
          success: true,
          reused: true,
          message: "Active payment session recovered. Proceed to payment.",
          data: {
            bookingReference: ref,
            cfOrderId: existingOrder.cf_order_id,
            paymentSessionId: existingOrder.payment_session_id,
            orderAmount: existingOrder.order_amount,
            orderStatus: existingOrder.order_status,
          },
        });
      }
    }

    // 7. Create Cashfree Sandbox order:
    // If an existing order was expired/cancelled, generate a unique retry suffix (e.g. VB-123456_829102)
    // so Cashfree accepts the new order for the SAME underlying booking.
    const orderIdToCreate = existingOrder
      ? `${ref}_${Date.now().toString().slice(-6)}`
      : ref;

    let cashfreeResult;
    try {
      cashfreeResult = await createCashfreeOrder({
        orderId: orderIdToCreate,
        customerId: ref,
        amount: orderAmount,
        customerDetails: adapter.customerDetails,
        returnUrl: adapter.returnUrl,
        orderNote: adapter.orderNote,
      });
    } catch (cashfreeError) {
      console.error("Cashfree order creation error:", cashfreeError?.response?.data || cashfreeError.message);

      const isCredentialError =
        cashfreeError.message?.toLowerCase().includes("credentials") ||
        cashfreeError.message?.toLowerCase().includes("unauthorized");

      return res.status(502).json({
        success: false,
        message: isCredentialError
          ? "Payment service is not configured correctly. Please contact support."
          : "Failed to initiate payment with the payment gateway. Please try again.",
      });
    }

    // 8. Persist the pending Cashfree order / session ID in DB via normalized adapter
    await adapter.setPendingSession(orderIdToCreate, cashfreeResult.paymentSessionId);

    // 9. Return the payment session information to the frontend
    return res.status(200).json({
      success: true,
      recreated: Boolean(existingOrder),
      message: existingOrder
        ? "New payment session created for existing booking. Proceed to payment."
        : "Payment order created. Proceed to payment.",
      data: {
        bookingReference: ref,
        cfOrderId: cashfreeResult.cfOrderId,
        paymentSessionId: cashfreeResult.paymentSessionId,
        orderAmount: cashfreeResult.orderAmount,
        orderStatus: cashfreeResult.orderStatus,
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the payment order. Please try again.",
    });
  }
};

// ---------------------------------------------------------------------------
// getPaymentBookingStatus
//
// GET /api/payments/booking-status/:bookingReference
//
// Provides safe, minimal booking state for frontend recovery after page reload.
// Polymorphically resolves both Consultation and Ritual bookings.
// ---------------------------------------------------------------------------
export const getPaymentBookingStatus = async (req, res) => {
  try {
    const { bookingReference } = req.params;

    if (!bookingReference || typeof bookingReference !== "string" || !bookingReference.trim()) {
      return res.status(400).json({
        success: false,
        message: "Booking reference is required.",
      });
    }

    const rawRef = bookingReference.trim();

    let adapter;
    try {
      adapter = await resolveBookingEntity(rawRef);
    } catch (err) {
      if (err instanceof BookingResolverError && err.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Booking not found.",
        });
      }
      throw err;
    }

    // Ownership check
    if (!adapter.canAccess(req.user)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking.",
      });
    }

    const ref = adapter.reference;

    // Proactive check: if booking is pending, check if Cashfree was already paid
    if (adapter.bookingStatus === "Pending") {
      const orderRefToCheck =
        adapter.transactionId && adapter.transactionId.startsWith(ref)
          ? adapter.transactionId
          : ref;
      try {
        const cfOrder = await fetchCashfreeOrder(orderRefToCheck);
        if (cfOrder?.order_status?.toUpperCase() === "PAID") {
          const trustedAmount = adapter.authoritativeAmount;
          const cfAmount = Number(cfOrder.order_amount);
          if (Math.abs(trustedAmount - cfAmount) <= 0.01) {
            let cfPaymentId = cfOrder.cf_order_id;
            let paymentGroup = null;
            try {
              const payments = await fetchCashfreeOrderPayments(cfOrder.order_id);
              const successPay = payments.find((p) => p.payment_status?.toUpperCase() === "SUCCESS");
              if (successPay?.cf_payment_id) cfPaymentId = successPay.cf_payment_id;
              if (successPay?.payment_group) paymentGroup = successPay.payment_group;
            } catch {
              // fallback to cf_order_id
            }
            await adapter.markConfirmed(cfPaymentId, paymentGroup);
          }
        }
      } catch {
        // Cashfree lookup is non-blocking during status check
      }
    }

    // Format safe response according to booking type
    if (adapter.type === BOOKING_TYPES.CONSULTATION) {
      const booking = adapter.entity;
      return res.status(200).json({
        success: true,
        data: {
          bookingReference: adapter.reference,
          bookingStatus: adapter.bookingStatus,
          paymentStatus: adapter.paymentStatus,
          amount: adapter.authoritativeAmount,
          packageId: booking.packageId,
          packageName: booking.packageName,
          duration: booking.duration,
          consultationDate: booking.consultationDate,
          consultationTime: booking.consultationTime,
          consultationMode: booking.consultationMode,
          fullName: booking.fullName,
          phone: booking.phone,
          email: booking.email,
          gender: booking.gender,
          dateOfBirth: booking.dateOfBirth,
          timeOfBirth: booking.timeOfBirth,
          placeOfBirth: booking.placeOfBirth,
          reportLanguage: booking.reportLanguage,
          selectedTopics: booking.selectedTopics,
          transactionId: adapter.transactionId,
        },
      });
    }

    // Generic Ritual Booking safe status response (never exposes private JSONB: sankalp, family, venue)
    const ritual = adapter.entity;
    return res.status(200).json({
      success: true,
      data: {
        bookingReference: adapter.reference,
        bookingStatus: adapter.bookingStatus,
        paymentStatus: adapter.paymentStatus,
        amount: adapter.authoritativeAmount,
        serviceType: ritual.serviceType,
        serviceSlug: ritual.serviceSlug,
        serviceName: ritual.serviceName,
        bookingDate: ritual.bookingDate,
        bookingTime: ritual.bookingTime,
        durationSelected: ritual.durationSelected,
        customerName: adapter.customerDetails.name,
        phone: adapter.customerDetails.phone,
        email: adapter.customerDetails.email,
        transactionId: adapter.transactionId,
        paymentSessionId: adapter.paymentSessionId,
        paymentGateway: adapter.paymentGateway,
      },
    });
  } catch (error) {
    console.error("Get payment booking status error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving booking status.",
    });
  }
};

// ---------------------------------------------------------------------------
// verifyPayment
//
// POST /api/payments/verify
//
// Receives:  { bookingReference } from frontend after checkout
// Validates:
//   - Booking exists and belongs to the requester (if registered)
//   - Real-time payment state directly from Cashfree Sandbox (fetch order + payments)
//   - Exact amount match between Database and Cashfree (<= 0.01 tolerance)
//   - Supports original bookingReference and retry order IDs
//
// Idempotency:
//   - If already Paid & Confirmed, returns the existing confirmed status safely.
// ---------------------------------------------------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const rawRef = req.body.bookingReference || req.body.orderId;

    if (!rawRef || typeof rawRef !== "string" || !rawRef.trim()) {
      return res.status(400).json({
        success: false,
        confirmed: false,
        message: "Booking reference is required for payment verification.",
      });
    }

    const trimmedRaw = rawRef.trim();

    // 1. Resolve booking entity via polymorphic Booking Resolver
    let adapter;
    try {
      adapter = await resolveBookingEntity(trimmedRaw);
    } catch (err) {
      if (err instanceof BookingResolverError && err.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          confirmed: false,
          message: "Booking not found. Please verify your reference.",
        });
      }
      throw err;
    }

    const ref = adapter.reference;

    // 2. Authorization check
    if (!adapter.canAccess(req.user)) {
      return res.status(403).json({
        success: false,
        confirmed: false,
        message: "You are not authorized to verify this booking.",
      });
    }

    // 3. Cancelled booking guard
    if (adapter.bookingStatus === "Cancelled") {
      return res.status(409).json({
        success: false,
        confirmed: false,
        message: "This booking has been cancelled and cannot be confirmed.",
      });
    }

    // 4. IDEMPOTENCY CHECK:
    // If webhook or previous verification already confirmed the payment
    if (adapter.paymentStatus === "Paid" && adapter.bookingStatus === "Confirmed") {
      return res.status(200).json({
        success: true,
        confirmed: true,
        message: "Payment already verified. Booking is confirmed.",
        data: {
          bookingReference: ref,
          bookingStatus: adapter.bookingStatus,
          paymentStatus: adapter.paymentStatus,
          transactionId: adapter.transactionId,
          amount: adapter.authoritativeAmount,
        },
      });
    }

    // 5. Server-side verification with Cashfree Sandbox API
    // Check candidate order IDs: retry order stored in transactionId, or trimmedRaw, or base ref
    let orderData;
    const candidateOrder =
      adapter.transactionId && adapter.transactionId.startsWith(ref)
        ? adapter.transactionId
        : trimmedRaw;

    try {
      orderData = await fetchCashfreeOrder(candidateOrder);
    } catch {
      if (candidateOrder !== ref) {
        try {
          orderData = await fetchCashfreeOrder(ref);
        } catch (fetchErr) {
          console.error("Error fetching order from Cashfree during verification:", fetchErr?.response?.data || fetchErr.message);
          return res.status(502).json({
            success: false,
            confirmed: false,
            message: "Unable to communicate with the payment gateway to verify status. Please try again.",
          });
        }
      } else {
        return res.status(502).json({
          success: false,
          confirmed: false,
          message: "Unable to communicate with the payment gateway to verify status. Please try again.",
        });
      }
    }

    const cashfreeStatus = orderData.order_status?.toUpperCase();

    // 6. Handle Cashfree order statuses
    if (cashfreeStatus === "PAID") {
      // 6a. CRITICAL AMOUNT VALIDATION: compare DB amount with Cashfree order amount
      const trustedAmount = adapter.authoritativeAmount;
      const cashfreeAmount = Number(orderData.order_amount);

      if (Math.abs(trustedAmount - cashfreeAmount) > 0.01) {
        console.error(
          `Security Alert: Payment amount mismatch for booking ${ref}. DB: ${trustedAmount}, Cashfree: ${cashfreeAmount}`,
        );
        return res.status(422).json({
          success: false,
          confirmed: false,
          message: "Payment amount mismatch detected. Please contact support.",
        });
      }

      // 6b. Retrieve payments to get the final cf_payment_id if available
      let cfPaymentId = orderData.cf_order_id;
      let paymentGroup = null;

      try {
        const payments = await fetchCashfreeOrderPayments(ref);
        const successPayment = payments.find((p) => p.payment_status?.toUpperCase() === "SUCCESS") || payments[0];
        if (successPayment) {
          if (successPayment.cf_payment_id) {
            cfPaymentId = successPayment.cf_payment_id;
          }
          if (successPayment.payment_group) {
            paymentGroup = successPayment.payment_group;
          }
        }
      } catch (payFetchErr) {
        console.warn("Could not fetch specific payment item list; using cf_order_id fallback:", payFetchErr.message);
      }

      // 6c. Transition booking to Confirmed / Paid via normalized adapter
      await adapter.markConfirmed(cfPaymentId, paymentGroup);

      const confirmationMsg = adapter.type === BOOKING_TYPES.CONSULTATION
        ? "Payment verified successfully. Your consultation is confirmed."
        : "Payment verified successfully. Your Puja booking is confirmed.";

      return res.status(200).json({
        success: true,
        confirmed: true,
        message: confirmationMsg,
        data: {
          bookingReference: ref,
          bookingStatus: "Confirmed",
          paymentStatus: "Paid",
          transactionId: String(cfPaymentId),
          amount: adapter.authoritativeAmount,
        },
      });
    }

    if (cashfreeStatus === "ACTIVE") {
      // Order is still open in Cashfree; user hasn't paid or payment is processing
      return res.status(200).json({
        success: true,
        confirmed: false,
        orderStatus: "ACTIVE",
        message: "Payment is pending or not yet completed with the payment gateway.",
        data: {
          bookingReference: ref,
          bookingStatus: adapter.bookingStatus,
          paymentStatus: adapter.paymentStatus,
        },
      });
    }

    // Handled for EXPIRED, CANCELLED, or other non-success states
    const serviceName = adapter.type === BOOKING_TYPES.CONSULTATION ? "Consultation" : "Puja booking";
    return res.status(200).json({
      success: false,
      confirmed: false,
      orderStatus: cashfreeStatus,
      message: `Payment order status is ${cashfreeStatus.toLowerCase()}. ${serviceName} is not confirmed.`,
      data: {
        bookingReference: ref,
        bookingStatus: adapter.bookingStatus,
        paymentStatus: adapter.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Payment verification controller error:", error);
    return res.status(500).json({
      success: false,
      confirmed: false,
      message: "An unexpected error occurred during payment verification. Please try again.",
    });
  }
};

// ---------------------------------------------------------------------------
// handleCashfreeWebhook
//
// POST /api/payments/webhook
//
// Receives server-to-server notifications from Cashfree.
//
// Security & Verification:
//   - Validates Cashfree HMAC-SHA256 signature using raw request body
//   - Polymorphically resolves booking via Booking Resolver
//   - Validates trusted amount from DB against webhook order/payment amount
//   - Idempotent: repeated events do not alter already-confirmed bookings
//   - Only genuine success transitions bookingStatus to Confirmed / Paid
// ---------------------------------------------------------------------------
export const handleCashfreeWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (!signature || !timestamp) {
      console.warn("Cashfree Webhook rejected: missing signature or timestamp headers.");
      return res.status(400).json({
        success: false,
        message: "Missing webhook signature or timestamp headers.",
      });
    }

    const rawBody = req.rawBody || JSON.stringify(req.body);

    // 1. Signature validation
    let verifiedEvent;
    try {
      verifiedEvent = verifyCashfreeWebhookSignature({
        signature,
        rawBody,
        timestamp,
      });
    } catch (sigErr) {
      console.error("Cashfree Webhook signature verification failed:", sigErr.message);
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const event = verifiedEvent?.object || req.body;
    const eventType = event?.type;
    const orderId = event?.data?.order?.order_id;

    if (!orderId) {
      console.warn("Cashfree Webhook received without order_id:", eventType);
      return res.status(400).json({
        success: false,
        message: "Missing order_id in webhook payload.",
      });
    }

    // 2. Find associated booking via polymorphic Booking Resolver
    let adapter;
    try {
      adapter = await resolveBookingEntity(orderId);
    } catch (resolveErr) {
      if (resolveErr instanceof BookingResolverError && resolveErr.code === "NOT_FOUND") {
        console.warn(`Cashfree Webhook: No booking found for order_id: ${orderId}`);
        // Return 200 so Cashfree does not repeatedly retry an unknown booking
        return res.status(200).json({
          success: true,
          message: `Booking ${orderId} not found. Acknowledged.`,
        });
      }
      throw resolveErr;
    }

    // 3. IDEMPOTENCY CHECK
    // If webhook or client verification already completed, acknowledge safely
    if (adapter.paymentStatus === "Paid" && adapter.bookingStatus === "Confirmed") {
      return res.status(200).json({
        success: true,
        message: "Booking already confirmed. Webhook acknowledged.",
      });
    }

    // 4. Check if event indicates a successful payment
    const paymentStatus = event?.data?.payment?.payment_status?.toUpperCase();
    const isSuccess =
      eventType === "PAYMENT_SUCCESS_WEBHOOK" ||
      eventType === "ORDER_PAID" ||
      paymentStatus === "SUCCESS";

    if (isSuccess) {
      // 4a. Amount verification
      const trustedAmount = adapter.authoritativeAmount;
      const webhookAmount = Number(
        event?.data?.order?.order_amount ?? event?.data?.payment?.payment_amount,
      );

      if (!isNaN(webhookAmount) && Math.abs(trustedAmount - webhookAmount) > 0.01) {
        console.error(
          `Security Alert: Webhook amount mismatch for booking ${orderId}. DB: ${trustedAmount}, Webhook: ${webhookAmount}`,
        );
        return res.status(422).json({
          success: false,
          message: "Payment amount mismatch detected in webhook.",
        });
      }

      // 4b. Extract final payment identifier
      const cfPaymentId =
        event?.data?.payment?.cf_payment_id ||
        event?.data?.order?.cf_order_id ||
        adapter.transactionId;

      const paymentGroup = event?.data?.payment?.payment_group || null;

      // 4c. Update booking state to Confirmed & Paid via normalized adapter
      await adapter.markConfirmed(cfPaymentId, paymentGroup);

      console.log(`Cashfree Webhook: Successfully confirmed booking ${orderId} (Payment ID: ${cfPaymentId})`);

      return res.status(200).json({
        success: true,
        message: "Webhook processed. Booking confirmed.",
      });
    }

    // 5. Non-success event (FAILED, USER_DROPPED, etc.)
    console.log(`Cashfree Webhook: Non-success event received for ${orderId}: ${eventType} (${paymentStatus})`);

    // Do NOT mark Confirmed or Paid
    return res.status(200).json({
      success: true,
      message: `Webhook acknowledged for non-success status: ${paymentStatus || eventType}`,
    });
  } catch (error) {
    console.error("Cashfree Webhook processing error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing webhook.",
    });
  }
};
