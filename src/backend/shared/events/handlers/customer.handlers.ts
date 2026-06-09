import { eventEmitter } from "../event-emitter";
import { EventType, BaseEvent } from "../event.types";
import { chatwootService } from "../../chatwoot/chatwoot.service";
import { logger } from "../../observability/logger.service";

// Customer event handlers
export const registerCustomerEventHandlers = () => {
  // Handle customer creation
  eventEmitter.subscribe(EventType.CUSTOMER_CREATED, async (event: BaseEvent) => {
    logger.info("Customer created", "customer-handler", event.data);
    // TODO: Send welcome email
    try {
      const { idComprador, customerEmail, customerName, customerPhone } = event.data;
      await chatwootService.createConversation(idComprador, customerEmail, customerName, customerPhone);
      logger.info(`Created Chatwoot conversation for customer ${idComprador}`, "customer-handler");
    } catch (error) {
      logger.error("Failed to create Chatwoot conversation", "customer-handler", { error });
    }
    // TODO: Trigger onboarding automation
  });

  // Handle customer activation
  eventEmitter.subscribe(EventType.CUSTOMER_ACTIVATED, async (event: BaseEvent) => {
    logger.info("Customer activated", "customer-handler", event.data);
    // TODO: Send activation confirmation
    try {
      const { idComprador } = event.data;
      const conversations = await chatwootService.searchConversations(idComprador);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, "Customer has been activated");
        logger.info(`Updated Chatwoot timeline for customer ${idComprador}`, "customer-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "customer-handler", { error });
    }
    // TODO: Trigger activation automation
  });

  // Handle customer deactivation
  eventEmitter.subscribe(EventType.CUSTOMER_DEACTIVATED, async (event: BaseEvent) => {
    logger.info("Customer deactivated", "customer-handler", event.data);
    // TODO: Send deactivation notification
    try {
      const { idComprador } = event.data;
      const conversations = await chatwootService.searchConversations(idComprador);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, "Customer has been deactivated");
        logger.info(`Updated Chatwoot timeline for customer ${idComprador}`, "customer-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "customer-handler", { error });
    }
    // TODO: Handle subscription cancellation
  });
};
