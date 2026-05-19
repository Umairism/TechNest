import { prisma } from "@/lib/db";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import crypto from "crypto";

/**
 * Payment Service
 * Handles payment processing for Pakistani payment methods:
 * - Cash on Delivery (COD)
 * - JazzCash
 * - EasyPaisa
 * - Credit/Debit Cards (via Stripe/2Checkout)
 */

export class PaymentService {
  /**
   * Create payment record
   */
  static async createPayment(
    orderId: string,
    amount: number,
    method: PaymentMethod
  ) {
    return await prisma.payment.create({
      data: {
        orderId,
        amount,
        method,
        currency: "PKR", // Pakistani Rupee
        status: method === "cod" ? "unpaid" : "unpaid",
      },
    });
  }

  /**
   * Get payment by order ID
   */
  static async getPaymentByOrderId(orderId: string) {
    return await prisma.payment.findUnique({
      where: { orderId },
    });
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    gatewayId?: string
  ) {
    return await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        gatewayId: gatewayId || undefined,
        lastAttempt: new Date(),
      },
    });
  }

  /**
   * Process Cash on Delivery (COD)
   * Most popular in Pakistan - no online payment required
   */
  static async processCOD(orderId: string) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new Error(`Payment not found for order ${orderId}`);
    }

    if (payment.method !== "cod") {
      throw new Error("Payment method is not COD");
    }

    // COD is essentially automatic - it's marked as unpaid until cash is collected
    return {
      success: true,
      message: "COD order created. Payment will be collected on delivery.",
      paymentId: payment.id,
      status: "pending_collection",
    };
  }

  /**
   * Mark COD payment as collected
   */
  static async collectCODPayment(paymentId: string) {
    return await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "paid",
        isCollected: true,
        collectedAt: new Date(),
      },
    });
  }

  /**
   * Initialize JazzCash Payment
   * Requires: JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD
   */
  static async initiateJazzCashPayment(
    orderId: string,
    amount: number,
    phoneNumber: string,
    email: string,
    redirectUrl: string
  ) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      throw new Error(`Payment not found for order ${orderId}`);
    }

    // Generate transaction reference
    const reference = `TECH-${orderId.slice(0, 8)}-${Date.now()}`;

    // Prepare JazzCash parameters
    const jazzcashParams = {
      pp_Version: "1.1",
      pp_TxnType: "MWWALLET",
      pp_Language: "EN",
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: "",
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_BankID: "",
      pp_ProductID: "",
      pp_TxnRefNo: reference,
      pp_Amount: Math.round(amount * 100), // Convert to cents
      pp_TxnCurrency: "PKR",
      pp_OriginatingCountry: "PK",
      pp_BillReference: orderId,
      pp_Description: `TechNest Order - ${orderId}`,
      pp_CustomerID: email,
      pp_CustomerEmail: email,
      pp_CustomerMobile: phoneNumber,
      pp_TxnDateTime: new Date().toISOString(),
      pp_TxnExpiryDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      pp_RedirectURL: redirectUrl,
      pp_IpAddress: "127.0.0.1", // Get actual IP in production
      pp_NotificationURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/jazzcash/callback`,
    };

    // Calculate checksum
    const checksumStr = `${jazzcashParams.pp_Amount}${jazzcashParams.pp_BillReference}${jazzcashParams.pp_Description}${jazzcashParams.pp_Language}${jazzcashParams.pp_MerchantID}${jazzcashParams.pp_Password}${jazzcashParams.pp_TxnRefNo}`;
    const checksum = crypto
      .createHash("sha256")
      .update(checksumStr)
      .digest("hex");

    // Store payment details
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        reference,
        gatewayId: "jazzcash_" + reference,
      },
    });

    return {
      success: true,
      redirectUrl: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform",
      params: { ...jazzcashParams, pp_SecureHash: checksum },
    };
  }

  /**
   * Initialize EasyPaisa Payment
   * Requires: EASYPAISA_STORE_ID, EASYPAISA_MERCHANT_ID
   */
  static async initiateEasypaisaPayment(
    orderId: string,
    amount: number,
    phoneNumber: string,
    email: string,
    redirectUrl: string
  ) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new Error(`Payment not found for order ${orderId}`);
    }

    const reference = `EP-${orderId.slice(0, 8)}-${Date.now()}`;

    const easypaisaParams = {
      storeid: process.env.EASYPAISA_STORE_ID,
      merchantid: process.env.EASYPAISA_MERCHANT_ID,
      txnrefno: reference,
      txnamt: amount.toFixed(2),
      txncurr: "PKR",
      txndesc: `TechNest Order - ${orderId}`,
      txnexpr: 1440, // 24 hours
      msisdn: phoneNumber.replace(/\D/g, "").slice(-10), // Extract 10 digits
      email: email,
      return_url: redirectUrl,
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/easypaisa/callback`,
      language: "EN",
    };

    // Calculate checksum
    const checksumStr = `${process.env.EASYPAISA_STORE_ID}${reference}${amount.toFixed(2)}${process.env.EASYPAISA_PASSWORD}`;
    const checksum = crypto
      .createHash("sha256")
      .update(checksumStr)
      .digest("hex");

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        reference,
        gatewayId: "easypaisa_" + reference,
      },
    });

    return {
      success: true,
      redirectUrl: "https://apiuat.easypaisa.com.pk/api/v2/Purchase",
      params: { ...easypaisaParams, checksum },
    };
  }

  /**
   * Verify payment callback (Webhook handler)
   */
  static async verifyPaymentCallback(
    method: "jazzcash" | "easypaisa",
    callbackData: any
  ) {
    if (method === "jazzcash") {
      return this.verifyJazzCashCallback(callbackData);
    } else if (method === "easypaisa") {
      return this.verifyEasypaisaCallback(callbackData);
    }
  }

  /**
   * Verify JazzCash callback
   */
  private static async verifyJazzCashCallback(data: any) {
    const reference = data.pp_TxnRefNo;

    const payment = await prisma.payment.findFirst({
      where: { reference },
    });

    if (!payment) {
      throw new Error(`Payment not found for reference ${reference}`);
    }

    if (data.pp_ResponseCode === "000") {
      // Payment successful
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "paid",
          gatewayId: data.pp_TxnRefNo,
        },
      });

      return { success: true, status: "paid" };
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          attempt: payment.attempt + 1,
        },
      });

      return { success: false, status: "failed", message: data.pp_ResponseMessage };
    }
  }

  /**
   * Verify EasyPaisa callback
   */
  private static async verifyEasypaisaCallback(data: any) {
    const reference = data.txnrefno;

    const payment = await prisma.payment.findFirst({
      where: { reference },
    });

    if (!payment) {
      throw new Error(`Payment not found for reference ${reference}`);
    }

    if (data.txnstatus === "success" || data.txnstatus === "1") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "paid",
          gatewayId: data.txnrefno,
        },
      });

      return { success: true, status: "paid" };
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          attempt: payment.attempt + 1,
        },
      });

      return { success: false, status: "failed" };
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(startDate?: Date, endDate?: Date) {
    const where = {
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const [total, paid, failed, byMethod] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.count({
        where: { ...where, status: "paid" },
      }),
      prisma.payment.count({
        where: { ...where, status: "failed" },
      }),
      prisma.payment.groupBy({
        by: ["method"],
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

    return {
      total,
      paid,
      failed,
      byMethod,
    };
  }
}
