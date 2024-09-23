import { ChangesEvent, MessagingEvent } from "@femto-sh/femto-shared/types"
import { sendTextMessage } from "@femto-sh/femto-shared/messenger"
import { debug } from "@femto-sh/femto-shared/utils"
import { defaultAdditionalAmount, defaultProductItem, genProductItems, products } from "./api"
import { cancelOrderHandler, completeOrderHandler, createOrderHandler, editOrderHandler, helpHandler, listProductHandler, switchPaymentModeHandler } from "./handler"

export const changeHook = async (change: ChangesEvent) => {
  debug('CHANGE', change)
  if (change.field === 'invoice_access_invoice_change') {
    debug('INVOICE CHANGE', change)

    const message = "We seen invoice updated with following data:\n\n" +
      "⏱️ Time: " + change.value.timestamp + "\n" +
      "💸 Buyer ID: " + change.value.buyer_id + "\n" +
      "📄 Page ID: " + change.value.page_id + "\n" +
      "📁 Event: " + change.value.event + "\n"

    await sendTextMessage(change.value.page_id, change.value.buyer_id, message)
  }

}

export const postbackHook = async (event: MessagingEvent) => {
  const senderID = event.sender.id
  const recipientID = event.recipient.id
  const postback = event.postback

  if (postback?.payload == 'P2M_PH_HELP') {
    await helpHandler(recipientID, senderID)
  }

  if (postback?.payload == 'P2M_PH_LIST_PRODUCT') {
    await listProductHandler(recipientID, senderID)
  }

  if (postback?.payload == 'P2M_PH_CREATE_ORDER') {
    await createOrderHandler(recipientID, senderID, ["onsite"], defaultProductItem, defaultAdditionalAmount)
  }

  if (postback?.payload == 'P2M_PH_CANCEL_ORDER') {
    await cancelOrderHandler(recipientID, senderID)
  }

  if (postback?.payload == 'P2M_PH_COMPLETE_ORDER') {
    await completeOrderHandler(recipientID, senderID)
  }

  if (postback?.payload.startsWith('P2M_PH_ADD_TO_ORDER')) {
    const [keyword, item_id] = postback.payload.toString().split(':')
    await editOrderHandler(recipientID, senderID, [item_id])
  }

  if (postback?.payload.startsWith('P2M_PH_PURCHASE')) {
    const [keyword, item_id] = postback.payload.toString().split(':')
    await sendTextMessage(recipientID, senderID, "Awaiting connect to Purchase API")
    //await editOrderHandler(recipientID, senderID, [item_id])
  }
}


export const messageHook = async (event: MessagingEvent) => {
  const senderID = event.sender.id
  const recipientID = event.recipient.id
  const message = event.message

  if (message?.text?.toString().startsWith("#order")
    || message?.text?.toString().startsWith("#create")
    || message?.text?.toString().startsWith("#pod")) {

    let modes = ["onsite"];
    if (message?.text?.toString().startsWith("#pod")) {
      modes = ["pod"]
    }

    const createCmd = message?.text?.split(" ");
    const cart: any = [];

    if (createCmd.length === 1 || createCmd[1] === '' || !isNaN(parseInt(createCmd[1]))) {
      // default order creation
      cart['P1'] = 1
    } else {
      const menuCode = Object.keys(products);

      const items = createCmd[1].toString().split(",")

      for (const itemCode of items) {
        if (menuCode.includes(itemCode.trim())) {
          const currentCartItems = Object.keys(cart);
          if (currentCartItems.includes(itemCode)) {
            cart[itemCode]++
          } else {
            cart[itemCode] = 1
          }
        }
      }
    }

    const productItems = genProductItems(cart);

    await createOrderHandler(recipientID, senderID, modes, productItems, defaultAdditionalAmount)
  }

  if (message?.text?.toString().startsWith("#switch")) {
    await switchPaymentModeHandler(recipientID, senderID)
  }

  if (message?.text?.toString().startsWith("#list")) {
    await sendTextMessage(recipientID, senderID, "Not implemented")
  }

  if (message?.text?.toString().startsWith("#help")) {
    await helpHandler(recipientID, senderID)
  }

  if (message?.text?.toString().startsWith("#product")) {
    await listProductHandler(recipientID, senderID)
  }

  if (message?.text?.toString().startsWith("#cancel")) {
    await cancelOrderHandler(recipientID, senderID)
  }

  if (message?.text?.toString().startsWith("#add")) {

    const addCmd = message.text.split(" ");
    if (addCmd.length == 1) {
      await sendTextMessage(recipientID, senderID, "No item specified.")
    } else {
      const items = addCmd[1].toString().split(",")
      await editOrderHandler(recipientID, senderID, items)
    }
  }

  if (message?.text?.toString().startsWith("#complete")) {
    await completeOrderHandler(recipientID, senderID)
  }

}