// Common types used throughout the application
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ApiError = {
  code: string;
  message: string;
  statusCode: number;
};

// Utility functions for API responses
export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const createErrorResponse = (
  error: string,
  message?: string
): ApiResponse => ({
  success: false,
  error,
  message,
});

// Payment utilities
export const formatPKR = (amount: number): string => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const convertToCents = (pkr: number): number => {
  return Math.round(pkr * 100);
};

export const convertFromCents = (cents: number): number => {
  return cents / 100;
};

// Date utilities
export const formatOrderDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Order utilities
export const getOrderStatusBadgeColor = (
  status: string
): "success" | "warning" | "destructive" | "secondary" => {
  switch (status) {
    case "delivered":
      return "success";
    case "shipped":
    case "confirmed":
      return "warning";
    case "cancelled":
    case "refunded":
      return "destructive";
    default:
      return "secondary";
  }
};

export const getOrderStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };
  return labels[status] || status;
};

// Payment utilities
export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    cod: "Cash on Delivery",
    jazzcash: "JazzCash",
    easypaisa: "EasyPaisa",
    card: "Credit/Debit Card",
  };
  return labels[method] || method;
};

export const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    unpaid: "Unpaid",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
  };
  return labels[status] || status;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePakistaniPhone = (phone: string): boolean => {
  // Pakistani phone numbers: 03XX-XXXXXXX or +923XX-XXXXXXX or 03XXXXXXXXX
  const regex = /^(?:\+92|0)?3[0-9]{2}[0-9]{7}$/;
  return regex.test(phone.replace(/[\s-]/g, ""));
};

export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Slug utilities
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Discount utilities
export const calculateDiscount = (
  originalPrice: number,
  currentPrice: number
): number => {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );
};

export const applyDiscount = (
  price: number,
  discountPercent: number
): number => {
  return Math.round(price * (1 - discountPercent / 100));
};

// Stock utilities
export const isInStock = (quantity: number): boolean => quantity > 0;

export const isLowStock = (quantity: number, threshold: number = 5): boolean =>
  quantity > 0 && quantity <= threshold;

export const getStockStatus = (
  quantity: number
): "in_stock" | "low_stock" | "out_of_stock" => {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= 5) return "low_stock";
  return "in_stock";
};

// Cart utilities
export const calculateCartTotal = (
  items: Array<{ price: number; quantity: number }>
): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateTax = (subtotal: number, taxRate: number = 0.08): number => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

// API rate limiting
export const getRateLimitWindow = (): number => {
  return parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 minutes
};

export const getRateLimitMaxRequests = (): number => {
  return parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");
};

// Logger utility
export const logAPI = (
  method: string,
  endpoint: string,
  status: number,
  duration: number
): void => {
  const timestamp = new Date().toISOString();
  const statusEmoji = status >= 200 && status < 300 ? "✅" : "❌";
  console.log(
    `${statusEmoji} [${timestamp}] ${method} ${endpoint} - ${status} (${duration}ms)`
  );
};

// Error handler
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      code: "INTERNAL_ERROR",
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred",
    statusCode: 500,
  };
};
