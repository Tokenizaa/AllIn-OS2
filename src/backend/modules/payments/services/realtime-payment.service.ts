import { logger } from '../../../shared/observability/logger.service';
import { eventEmitter } from '../../../shared/events/event-emitter';

export interface PaymentStatusUpdate {
  paymentId: string;
  status: string;
  idComprador: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class RealtimePaymentService {
  private static instance: RealtimePaymentService;
  private activeSubscriptions: Map<string, Set<(update: PaymentStatusUpdate) => void>> = new Map();

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): RealtimePaymentService {
    if (!RealtimePaymentService.instance) {
      RealtimePaymentService.instance = new RealtimePaymentService();
    }
    return RealtimePaymentService.instance;
  }

  private setupEventListeners(): void {
    // Subscribe to payment events to broadcast updates
    eventEmitter.subscribe('payment.approved' as any, async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'approved',
        idComprador: event.data.idComprador,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.rejected' as any, async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'rejected',
        idComprador: event.data.idComprador,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.refunded' as any, async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'refunded',
        idComprador: event.data.idComprador,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.cancelled' as any, async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'cancelled',
        idComprador: event.data.idComprador,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.pending' as any, async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'pending',
        idComprador: event.data.idComprador,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });
  }

  subscribeToPaymentUpdates(
    idComprador: string,
    callback: (update: PaymentStatusUpdate) => void
  ): () => void {
    logger.info('Subscribing to payment updates', 'realtime-payment-service', { idComprador });

    if (!this.activeSubscriptions.has(idComprador)) {
      this.activeSubscriptions.set(idComprador, new Set());
    }

    this.activeSubscriptions.get(idComprador)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscriptions = this.activeSubscriptions.get(idComprador);
      if (subscriptions) {
        subscriptions.delete(callback);
        if (subscriptions.size === 0) {
          this.activeSubscriptions.delete(idComprador);
        }
      }
      logger.info('Unsubscribed from payment updates', 'realtime-payment-service', { idComprador });
    };
  }

  subscribeToPayment(
    paymentId: string,
    idComprador: string,
    callback: (update: PaymentStatusUpdate) => void
  ): () => void {
    logger.info('Subscribing to specific payment updates', 'realtime-payment-service', { paymentId, idComprador });

    const wrappedCallback = (update: PaymentStatusUpdate) => {
      if (update.paymentId === paymentId) {
        callback(update);
      }
    };

    return this.subscribeToPaymentUpdates(idComprador, wrappedCallback);
  }

  private async broadcastStatusUpdate(update: PaymentStatusUpdate): Promise<void> {
    logger.info('Broadcasting payment status update', 'realtime-payment-service', { 
      paymentId: update.paymentId, 
      status: update.status,
      idComprador: update.idComprador 
    });

    const subscriptions = this.activeSubscriptions.get(update.idComprador);
    if (subscriptions) {
      const promises = Array.from(subscriptions).map(async (callback) => {
        try {
          await callback(update);
        } catch (error) {
          logger.error('Error in payment status callback', 'realtime-payment-service', { error });
        }
      });
      await Promise.all(promises);
    }

    // TODO: Integrate with Supabase Realtime for actual WebSocket broadcasting
    // This would involve publishing to a Supabase channel
    // await supabase.channel(`payment:${update.paymentId}`).send({
    //   type: 'broadcast',
    //   event: 'status_update',
    //   payload: update,
    // });
  }

  async notifyPaymentCreated(paymentId: string, idComprador: string): Promise<void> {
    await this.broadcastStatusUpdate({
      paymentId,
      status: 'pending',
      idComprador,
      timestamp: new Date().toISOString(),
    });
  }

  getActiveSubscriptionCount(idComprador: string): number {
    return this.activeSubscriptions.get(idComprador)?.size || 0;
  }

  getTotalActiveSubscriptions(): number {
    let total = 0;
    for (const subscriptions of this.activeSubscriptions.values()) {
      total += subscriptions.size;
    }
    return total;
  }
}

export const realtimePaymentService = RealtimePaymentService.getInstance();
