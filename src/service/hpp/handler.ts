import { genOrderId, getCurrentOrderId } from "../../utils/data"
import { sendButtonTemplate, sendGenericTemplate, sendTextMessage } from "../../utils/messenger"
import { debug } from "../../utils/utils"

import { AdditionalAmount, FeatureConfig, ProductItem, cancelInvoice, completeInvoice, createInvoice, editInvoice, products, switchPaymentMode } from "./api"

export const switchPaymentModeHandler = async (recipientID: string, senderID: string) => {
  const currentOrder = await getCurrentOrderId(senderID)

  if (currentOrder && currentOrder.invoice_id && currentOrder.invoice_id != "") {
    const result = await switchPaymentMode(recipientID, senderID, currentOrder.invoice_id)
    if (result === false) {
      await sendTextMessage(recipientID, senderID, `Failed to update order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}]`)
    } else {
      await sendTextMessage(recipientID, senderID, `Successfully update order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}]`)
    }
  } else {
    await sendTextMessage(recipientID, senderID, "No current active order")
  }
}

export const cancelOrderHandler = async (recipientID: string, senderID: string) => {
  const currentOrder = await getCurrentOrderId(senderID)

  if (currentOrder && currentOrder.invoice_id && currentOrder.invoice_id != "") {
    const result = await cancelInvoice(recipientID, senderID, currentOrder.invoice_id)
    if (result === false) {
      await sendTextMessage(recipientID, senderID, `Failed to cancel order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}]`)
    } else {
      await sendTextMessage(recipientID, senderID, `Successfully cancel order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}]`)
    }
  } else {
    await sendTextMessage(recipientID, senderID, "No current active order")
  }
}

export const completeOrderHandler = async (recipientID: string, senderID: string) => {
  const currentOrder = await getCurrentOrderId(senderID)

  if (currentOrder && currentOrder.invoice_id && currentOrder.invoice_id != "") {
    const result = await completeInvoice(recipientID, senderID, currentOrder.invoice_id)
    if (result === false) {
      await sendTextMessage(recipientID, senderID, `Failed to mark order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}] as completed`)
    } else {
      await sendTextMessage(recipientID, senderID, `Successfully mark order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}] as completed`)
    }
  } else {
    await sendTextMessage(recipientID, senderID, "No current active order")
  }
}

export const createOrderHandler = async (recipientID: string, senderID: string, modes: string[], product_items: ProductItem[], additional_amounts: AdditionalAmount[]) => {
  const order_id = await genOrderId(recipientID)

  // TODO: Fix this :(
  const features: FeatureConfig = {
    "enable_messaging": true,
    "enable_product_item_removal": false,
    "payment_modes": modes
  }

  await createInvoice(recipientID, senderID, order_id.toString().padStart(5, '0'), "Test", product_items, additional_amounts, features, null)
}

export const editOrderHandler = async (recipientID: string, senderID: string, items: string[]) => {
  const currentOrder = await getCurrentOrderId(senderID)
  if (currentOrder && currentOrder.invoice_id && currentOrder.invoice_id != "") {
    const result = await editInvoice(recipientID, senderID, currentOrder.invoice_id, items)
    if (result === false) {
      await sendTextMessage(recipientID, senderID, `Failed to update order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}]`)
    } else {
      await sendTextMessage(recipientID, senderID, `Successfully update order ID [${currentOrder.order_id}]/invoice ID [${currentOrder.invoice_id}]`)
    }
  } else {
    await sendTextMessage(recipientID, senderID, "No current active order")
  }
}

export const helpHandler = async (recipientID: string, senderID: string) => {
  const message = "Available commands:\n\n"
    + "#order/#create - create order\n\n"
    + "#pod - create POD order\n\n"
    + "#product - get product list\n\n"
    + "#order <product_id> - create order with specific product\n\n"
    + "#pod <product_id> - create order with specific product\n\n"
    + "#create <product_id> - create order with specific product\n\n"
    + "#add <product_id> - Cancel last order\r\n"
    + "#cancel - Cancel last order\r\n"
    + "#complete - Mark last order as completed\r\n"
    + "#switch - Switch payment mode for current order"

  const buttons = [
    {
      "type": "postback",
      "payload": "P2M_PH_CREATE_ORDER",
      "title": "Create Order"
    },
    {
      "type": "postback",
      "payload": "P2M_PH_CANCEL_ORDER",
      "title": "Cancel Last Order"
    }, {
      "type": "postback",
      "payload": "P2M_PH_COMPLETE_ORDER",
      "title": "Complete Last Order"
    }

  ]

  await sendButtonTemplate(recipientID, senderID, message, buttons)
}

export const listProductHandler = async (recipientID: string, senderID: string) => {

  let elements = []
  for (const product in products) {
    const item = {
      title: `${products[product].external_id} - ${products[product].name}`,
      image_url:"https://mahasak.com/banners/smart_banner.jpg",
      subtitle: `${products[product].description} (${products[product].price} PHP)`,
      buttons: [{
        type: "postback",
        title: "Purchase",
        
        payload: `P2M_PH_PURCHASE:${products[product].external_id}`
      }]
    }
    elements.push(item)
  }

  const currentOrder = await getCurrentOrderId(senderID)
  debug("session", currentOrder)

  sendGenericTemplate(recipientID, senderID, elements)
}
