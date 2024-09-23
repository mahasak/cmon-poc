export const enum FemtoLogLevel {
    DEBUG,
  VERBOSE,
  INFO,
  WARN,
  ERROR
}

export interface FemtoLogRecord {
    timestamp: number;
    level?: FemtoLogLevel;
    country?: string;
    service?: string;
    channel?: string;
    objectId?: string;
    message: string;
    extraData?: any;
}

export interface P2MSessionData {
    order_id: string;
    invoice_id: string;
}

// See https://developers.facebook.com/docs/messenger-platform/webhook-reference
export interface WebhookEvent {
    object: 'page';
    entry: WebhookEntry[];
}

export interface WebhookEntry {
    id: string;
    time: number;
    messaging?: Array<MessagingEvent>;
    changes?: Array<ChangesEvent>;
}

export interface ChangesEvent {
    field: string;
    value: any | InvoiceChangeEvent | BankSlipEvent;
}

export interface InvoiceChangeEvent {
    page_id: string;
    invoice_id: string;
}

export interface BankSlipEvent {
    page_id: string;
    media_id: string;
    buyer_id: string;
    timestamp: number;
    event: BankSlipEventType;
    payment: PaymentInfo;
}

export interface PaymentAmount {
    amount: string;
    currency: string;
}

export interface BankSlipValidationInfo {
    payment_amount: PaymentAmount;
    payment_time: BankSlipPaymentTimeType;
    is_seller_onboarded: boolean;
    matches_seller_account: boolean;
    is_duplicate: boolean;
}

export interface BankSlipPaymentMetadata {
    image_url: string;
    bank_transfer_id: string;
    media_id: string;
    amount_validated: PaymentAmount;
    transaction_time: number;
    validation_info: BankSlipValidationInfo;
    validation_status: string;
    receiver_name: string;
    receiver_bank_account_id: string;
    receiver_bank_code: string;
    sender_name: string;
    sender_bank_account_id: string;
    sender_bank_code: string;
}

export interface HybridPaymentMetadata {
    hpp_payment_link: {
        psp_txn_id: string;
        payment_status: string;
        payment_provider: string;
        updated_time: string;
    }
}

export interface PaymentInfo {
    payment_amount: BankSlipPaymentAmountType;
    payment_method: "bank_slip";
    creation_time: number;
    buyer_id: string;
    order_id?: string;
    payment_id: string;
    metadata: BankSlipPaymentMetadata | HybridPaymentMetadata;
}


export interface MessagingEvent {
    message?: Message;
    delivery?: DeliveryInfo;
    postback?: Postback;
    read?: ReadInfo;
    optin?: PluginOptin;
    account_linking: AccountLinkingInfo;
    sender: Sender;
    recipient: Recipient;
    reaction: Reaction;
    timestamp: number;
}

export interface AccountLinkingInfo {
    status: AccountLinkingStatus,
    authorization_code: string;
}

export interface Sender {
    id: string;
}

export interface Recipient {
    id: string;
}

export interface ReplyTo {
    mid: string;
}

export interface Message {
    mid: string;
    text?: string;
    quick_reply?: QuickReply;
    reply_to: ReplyTo;
    attachments?: Attachment[];
    referral?: ProductReferral;
    is_echo?: boolean;
    app_id?: string;
    metadata?: string;
}

export interface ProductReferral {
    product?: {
        id?: string;
    }
}

export interface MultimediaPayload {
    url: string;
}

export type Attachment = MediaAttachment | TemplateAttachment;

export interface MediaAttachment {
    type: AttachmentType.AUDIO | AttachmentType.FILE | AttachmentType.IMAGE | AttachmentType.VIDEO;
    payload: MediaAttachmentPayload;
}

export interface TemplateAttachment {
    type: AttachmentType.TEMPLATE;
    payload: MediaAttachmentPayload;
}

export interface MediaAttachmentPayload {
    url: string;
}

export interface TemplateAttachmentPayload {
    product?: {
        elements?: ProductElement;
    }
}

export interface ProductElement {
    id: string;
    retailer_id: string;
    image_url: string;
    title: string;
    subtitle: string;
}

export interface QuickReply {
    payload: string;
}


export interface Postback {
    mid: string;
    payload: string;
    referral?: PostbackReferral;
    title?: string;
}

export interface PostbackPayload {
    src: PostbackSource;
    data: any;
    id?: string;
}

export interface DeliveryInfo {
    mids: string[];
    watermark: number;
}

export interface ReadInfo {
    watermark: number;
}

export interface Reaction {
    mid: string;
    reaction: ReactionType;
    emoji: string;
    action: string;
}

export interface PostbackReferral {
    ref?: string;
    source: ReferralSource;
    type: string;
}

export interface PluginOptin {
    ref: string;
}

export enum AccountLinkingStatus {
    LINK = "linked",
  UNLINKED = "unlinked"
}

export enum PostbackSource {
    GET_STARTED_BUTTON = "get-started-button",
  POSTBACK_BUTTON = "postback-button",
  PERSISTENT_MENU = "persistent-menu"
}

export enum ReactionType {
    SMILE = "image",
  ANGRY = "audio",
  SAD = "video",
  WOW = "wow",
  LOVE = "love",
  LIKE = "like",
  DISLIKE = "dislike",
  OTHER = "other"
}

export enum AttachmentType {
    IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  FILE = "file",
  TEMPLATE = "template",
  FALLBACK = "fallback"
}

export enum ReferralSource {
    SHORTLINK = "SHORTLINK",
  ADS = "ADS",
  MESSENGER_CODE = "MESSENGER_CODE",
  DISCOVER_TAB = "DISCOVER_TAB"
}

export enum BankSlipEventType {
    DETECTED = "detected",
  VERIFIED = "verified",
  CONFIRNMED = "confirmed",
  DISMISSED = "dismissed"
}

export enum BankSlipPaymentAmountType {
    AMOUNT_PAID_MATCH = "AMOUNT_PAID_MATCH",
  AMOUNT_PAID_LOWER = "AMOUNT_PAID_LOWER",
  AMOUNT_PAID_HIGHER = "AMOUNT_PAID_HIGHER"
}

export enum BankSlipPaymentTimeType {
    PAID_WITHIN_TIME_RANGE = "PAID_WITHIN_TIME_RANGE",
  PAID_LATE = "PAID_LATE",
  PAID_EARLY = "PAID_EARLY",
}