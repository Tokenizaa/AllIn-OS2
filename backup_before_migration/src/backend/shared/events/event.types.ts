export enum EventType {
  // Customer Events
  CUSTOMER_CREATED = "customer.created",
  CUSTOMER_UPDATED = "customer.updated",
  CUSTOMER_DELETED = "customer.deleted",
  CUSTOMER_ACTIVATED = "customer.activated",
  CUSTOMER_DEACTIVATED = "customer.deactivated",

  // Order Events
  ORDER_CREATED = "order.created",
  ORDER_UPDATED = "order.updated",
  ORDER_CANCELLED = "order.cancelled",
  ORDER_SHIPPED = "order.shipped",
  ORDER_DELIVERED = "order.delivered",

  // Payment Events
  PAYMENT_CREATED = "payment.created",
  PAYMENT_APPROVED = "payment.approved",
  PAYMENT_REJECTED = "payment.rejected",
  PAYMENT_REFUNDED = "payment.refunded",
  PAYMENT_CANCELLED = "payment.cancelled",
  PAYMENT_PENDING = "payment.pending",

  // Wallet Events
  WALLET_CREDITED = "wallet.credited",
  WALLET_DEBITED = "wallet.debited",

  // Bonus/Points Events
  BONUS_EARNED = "bonus.earned",
  BONUS_USED = "bonus.used",
  POINTS_EARNED = "points.earned",
  POINTS_REDEEMED = "points.redeemed",

  // Plan Events
  PLAN_ACTIVATED = "plan.activated",
  PLAN_DEACTIVATED = "plan.deactivated",
  PLAN_UPGRADED = "plan.upgraded",
  PLAN_DOWNGRADED = "plan.downgraded",

  // Bonus Events
  BONUS_GENERATED = "bonus.generated",
  BONUS_DISTRIBUTED = "bonus.distributed",

  // Network Events
  NETWORK_JOINED = "network.joined",
  NETWORK_LEFT = "network.left",
}

export interface BaseEvent {
  type: EventType;
  timestamp: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export type EventHandler = (event: BaseEvent) => Promise<void> | void;

export interface EventSubscription {
  eventType: EventType;
  handler: EventHandler;
}
