import { encode } from "punycode";
import { genChannelData, setCurrentOrderId } from "../../utils/data";

export interface CreateInvoicePayload {
  buyer_id: string;
  product_items: ProductItem[];
  external_invoice_id?: string;
  note?: string;
  additional_amounts?: AdditionalAmount[];
  features?: FeatureConfig;
  shipping_address?: string;
}
export interface Product {
  external_id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
}

export interface ProductItem {
  external_id: string;
  name: string;
  quantity: number;
  description: string;
  currency_amount: {
    amount: number,
    currency: string
  }
}

export interface AdditionalAmount {
  type: string;
  currency_amount: {
    amount: number,
    currency: string
  }
}

export const defaultAdditionalAmount: AdditionalAmount[] = [
  {
    type: "DISCOUNT",
    currency_amount: {
      "amount": -10,
      "currency": "PHP"
    }
  },
  {
    type: "SHIPPING",
    currency_amount: {
      "amount": 20,
      "currency": "PHP"
    }
  },
  {
    type: "TAX",
    currency_amount: {
      "amount": 5,
      "currency": "PHP"
    }
  }
]

export const defaultProductItem: ProductItem[] = [{
  external_id: "P1",
  name: "Pokemon mousepad",
  quantity: 1,
  description: "Red and blue Pokemon mousepad.",
  currency_amount: {
    amount: 20.0,
    currency: "PHP"
  }
}]

export interface FeatureConfig {
  enable_messaging?: boolean;
  enable_product_item_removal?: boolean;
  payment_modes: string[]
}

export interface Cart {
  [key: string]: number;
}

export const products: { [key: string]: Product } = {
  "P1": {
    external_id: "1602481202",
    name: "2GB + 1GB/day for YT/NF",
    quantity: 1,
    description: "2GB + 1GB/day for YouTube, Netflix & more + Unli Allnet Texts for 3 days",
    price: 20
  },
  "P2": {
    external_id: "1602486013",
    name: "2GB + 1GB",
    quantity: 1,
    description: "2GB + 1GB per day of TikTok, IG, FB, X, Kumu for 3 days",
    price: 25
  },
  "P3": {
    external_id: "1600821093",
    name: "2GB data",
    quantity: 1,
    description: "2GB data for all sites and apps for 3 days",
    price: 30
  },
  "P4": {
    external_id: "1601472304",
    name: "100MB + 100 Allnet",
    quantity: 1,
    description: "100MB + 100 Allnet Mins + 100 Allnet Texts for 1 day",
    price: 35
  },
  "P5": {
    external_id: "1601752550",
    name: "8GB data",
    quantity: 1,
    description: "8GB data + UNLI TikTok EVERYDAY + Unli Allnet Texts for 7 days",
    price: 35
  },
  "P6": {
    external_id: "3761",
    name: "500MB FB/IG/WA",
    quantity: 1,
    description: "500MB araw-araw for FB, IG & WhatsApp for 7 days",
    price: 35
  },
  "P7": {
    external_id: "1601410645",
    name: "2GB data + 2GB per day",
    quantity: 1,
    description: "2GB data + 2GB per day for all sites for 3 days",
    price: 35
  },
  "B1": {
    external_id: "1602064399",
    name: "Borrow 100MB",
    quantity: 1,
    description: "Utang na Load: Borrow 100MB FB & Messenger access data valid for 1 day",
    price: 35
  },
  "B2": {
    external_id: "1602064619",
    name: "Borrow 200MB",
    quantity: 1,
    description: "Utang na Load: Borrow 200MB open access data valid for 1 day",
    price: 35
  },
  "B3": {
    external_id: "1602410673",
    name: "Borrow 300MB",
    quantity: 1,
    description: "Utang na Load: Borrow 300MB open access data valid for 1 day",
    price: 35
  }
}

export const genProductItems = (cart: Cart) => {
  const productItems: ProductItem[] = [];
  const currentCartItems = Object.keys(cart);

  const menuCode = Object.keys(products);

  for (const itemCode of currentCartItems) {
    if (menuCode.includes(itemCode)) {
      productItems.push({
        "external_id": itemCode,
        "name": products[itemCode].name,
        "quantity": cart[itemCode],
        "description": products[itemCode].description,
        "currency_amount": {
          "amount": products[itemCode].price,
          "currency": "PHP"
        }
      })
    }
  }

  return productItems
}


export const createInvoice = async (page_id: string, buyer_id: string, external_invoice_id: string, note: string, product_items: ProductItem[], additional_amounts: AdditionalAmount[], features: null | FeatureConfig, shipping_address: null) => {
  const payload: CreateInvoicePayload = {
    buyer_id: buyer_id,
    product_items: product_items,
  }

  if (external_invoice_id !== null && external_invoice_id !== undefined) {
    payload.external_invoice_id = external_invoice_id
  }

  if (note !== null && note !== undefined) {
    payload.note = note
  }

  if (additional_amounts !== null && additional_amounts !== undefined) {
    payload.additional_amounts = additional_amounts

    console.log(additional_amounts)
  }

  if (features !== null && features !== undefined) {
    payload.features = features
  }

  if (shipping_address !== null && shipping_address !== undefined) {
    payload.shipping_address = shipping_address
  }

  try {
    const pageConfig = await genChannelData("FACEBOOK_PAGE", page_id);
    if (pageConfig && pageConfig.token && pageConfig.token !== "") {
      console.log(payload);
      const res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/invoice_access_invoice_create?access_token=${pageConfig.token}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }

      })

      console.log(payload)
      console.log(JSON.stringify(payload))

      const data = await res.json()
      const recipientId = data.recipient_id
      const messageId = data.message_id

      if (res.ok) {
        await setCurrentOrderId(buyer_id, external_invoice_id ?? 0, data.invoice_id ?? 0)
        console.log(data)

        console.log(`[messenger] Successfully create invoice ID [${data.invoice_id}] for buyer ID [${buyer_id}], page ID [${page_id}]`)

        return {
          order_id: external_invoice_id,
          invoice_id: data.invoice_id
        }
      } else {

        console.log(data)
        console.log(`[messenger] Failed to create invoice for buyer ID [${buyer_id}], page ID [${page_id}]`)

        return false
      }
    }
  } catch (error) {
    console.log(`[messenger] Create API error`, error)
    return false
  }
}

export const completeInvoice = async (page_id: string, buyer_id: string, invoice_id: string) => {
  try {
    const pageConfig = await genChannelData("FACEBOOK_PAGE", page_id);
    if (pageConfig && pageConfig.token && pageConfig.token !== "") {

      const payload = {
        invoice_id: invoice_id
      }

      const res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/invoice_access_invoice_complete?access_token=${pageConfig.token}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await res.json()
      const recipientId = data.recipient_id
      const messageId = data.message_id

      if (res.ok) {
        await setCurrentOrderId(buyer_id, "", "")
        console.log(`[messenger] Successfully mark as complete for invoice ID [${invoice_id}], page ID [${page_id}]`)
        return true

      } else {
        console.log(data)
        console.log(`[messenger] Failed mark as complete for invoice ID [${invoice_id}], page ID [${page_id}]`)
        return false
      }
    }
  } catch (error) {
    console.log(`[messenger] Mark as complete API error`, error)
    return false
  }
}

export const cancelInvoice = async (page_id: string, buyer_id: string, invoice_id: string) => {
  try {
    const pageConfig = await genChannelData("FACEBOOK_PAGE", page_id);
    if (pageConfig && pageConfig.token && pageConfig.token !== "") {

      const payload = {
        invoice_id: invoice_id
      }
      console.log(payload);
      const res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/invoice_access_invoice_cancel?access_token=${pageConfig.token}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }

      })

      const data = await res.json()
      const recipientId = data.recipient_id
      const messageId = data.message_id

      if (res.ok) {
        await setCurrentOrderId(buyer_id, "", "")
        console.log(`[messenger] Successfully cancel for invoice ID [${invoice_id}], page ID [${page_id}]`)
        return true

      } else {
        console.log(data);
        console.log(`[messenger] Failed cancel for invoice ID [${invoice_id}], page ID [${page_id}]`)
        return false
      }
    }
  } catch (error) {
    console.log(`[messenger] Cancel API error`, error)
    return false
  }
}

export const editInvoice = async (page_id: string, buyer_id: string, invoice_id: string, items: string[]) => {
  try {
    const pageConfig = await genChannelData("FACEBOOK_PAGE", page_id);
    if (pageConfig && pageConfig.token && pageConfig.token !== "") {
      // Read invoice details
      const res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/invoice_access_invoice_details?invoice_id=${invoice_id}&access_token=${pageConfig.token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }

      })

      const data = await res.json()
      const recipientId = data.recipient_id
      const messageId = data.message_id

      if (res.ok) {
        console.log(`[messenger] Read detail for invoice ID [${invoice_id}], page ID [${page_id}]`)

        const cart: any = [];
        for (const item of data.data[0].product_items) {
          cart[item.external_id] = item.quantity
        }
        const menuCode = Object.keys(products);

        for (const itemCode of items) {
          if (menuCode.includes(itemCode.trim())) {
            const currentCartItems: string[] = Object.keys(cart);
            if (currentCartItems.includes(itemCode)) {
              cart[itemCode]++
            } else {
              cart[itemCode] = 1
            }
          }
        }

        const updated_product_items = genProductItems(cart);

        const payload = {
          invoice_id: invoice_id,
          product_items: updated_product_items,
          additional_amounts: defaultAdditionalAmount,
        }

        const update_res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/invoice_access_invoice_edit?access_token=${pageConfig.token}`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        })

        if (update_res.ok) {
          console.log(`[messenger] Successfully update for invoice ID [${invoice_id}], page ID [${page_id}]`)
          return true

        } else {
          console.log(`[messenger] Failed to update for invoice ID [${invoice_id}], page ID [${page_id}]`)
          return false
        }

      } else {
        console.log(`[messenger] Failed to read detail  for invoice ID [${invoice_id}], page ID [${page_id}]`)
        return false
      }
    }
  } catch (error) {
    console.log(`[messenger] Edit API error`, error)
    return false
  }
}

export const switchPaymentMode = async (page_id: string, buyer_id: string, invoice_id: string) => {
  try {
    const pageConfig = await genChannelData("FACEBOOK_PAGE", page_id);
    if (pageConfig && pageConfig.token && pageConfig.token !== "") {
      // Read invoice details
      const res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/invoice_access_invoice_details?invoice_id=${invoice_id}&access_token=${pageConfig.token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }

      })

      const data = await res.json()
      const recipientId = data.recipient_id
      const messageId = data.message_id

      if (res.ok) {
        console.log(`[messenger] Read detail for invoice ID [${invoice_id}], page ID [${page_id}]`)

        const cart: any = [];
        for (const item of data.data[0].product_items) {
          cart[item.external_id] = item.quantity
        }
        const updated_product_items = genProductItems(cart);

        console.log(data.data[0].features)
        let features: FeatureConfig = {
          payment_modes: ["pod"]
        }
        if (Array.from(data.data[0].features.payment_modes).includes("pod")) {
          features = {
            payment_modes: ["onsite"]
          }
        } 

        const payload = {
          invoice_id: invoice_id,
          product_items: updated_product_items,
          additional_amounts: defaultAdditionalAmount,
          features: features
        }

        const update_res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/invoice_access_invoice_edit?access_token=${pageConfig.token}`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        })

        if (update_res.ok) {
          console.log(`[messenger] Successfully update for invoice ID [${invoice_id}], page ID [${page_id}]`)
          return true

        } else {
          console.log(`[messenger] Failed to update for invoice ID [${invoice_id}], page ID [${page_id}]`)
          return false
        }

      } else {
        console.log(`[messenger] Failed to read detail  for invoice ID [${invoice_id}], page ID [${page_id}]`)
        return false
      }
    }
  } catch (error) {
    console.log(`[messenger] Edit API error`, error)
    return false
  }
}