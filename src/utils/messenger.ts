import {genChannelData} from "./data";

export const callSendAPI = async (page_id: string, message_data: any) => {
    try {
        const pageConfig = await genChannelData("FACEBOOK_PAGE", page_id);
        if (pageConfig && pageConfig.token && pageConfig.token !== "") {
            const res = await fetch(`https://graph.facebook.com/v14.0/${page_id}/messages?access_token=${pageConfig.token}`, {
                method: 'POST',
                body: JSON.stringify(message_data),
                headers: {'Content-Type': 'application/json'}

            });

            const data: any = await res.json();
            const recipientId = data.recipient_id;
            const messageId = data.message_id;

            if (res.ok) {
                console.log(`[{service}] Successfully send message to PSID: ${recipientId} ${messageId !== undefined ? 'messageId:' + messageId : ''}`);
            } else {
                console.log(`[{service}] Failed to send message to PSID: ${recipientId}`);
            }
        }
    } catch (error) {
        console.log(`[{service}] Send API error`, error);
    }
}

export const markSeen = async (page_id: string, psid: string) => {
    const messageData = {
        recipient: {
            id: psid
        },
        "sender_action": "mark_seen"
    };

    await callSendAPI(page_id, messageData);
}

export const sendButtonTemplate = async (page_id: string, recipientId: string, message: string, buttons: any) => {
    const payload = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: message,
                    buttons: buttons
                }
            }
        }
    };

    await callSendAPI( page_id, payload);
}

export const sendGenericTemplate = async ( page_id: string, recipientId: string, elements: any) => {
    const payload = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };

    await callSendAPI( page_id, payload);
}

export const sendMessageTemplate = async (page_id: string, recipientId: string, template: any) => {
    const payload = {
        recipient: {
            id: recipientId
        },
        message: template
    };

    await callSendAPI( page_id, payload);
}

export const sendQuickReplies = async ( page_id: string, recipientId: string, messageText: string, choices: any) => {
    const payload = {
        recipient: {
            id: recipientId
        },
        messaging_type: "RESPONSE",
        message: {
            text: messageText,
            quick_replies: choices
        }
    };

    await callSendAPI( page_id, payload);
}

export const sendTextMessage = async (page_id: string, recipientId: string, messageText: string) => {
    const messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    await callSendAPI(page_id, messageData);
}
