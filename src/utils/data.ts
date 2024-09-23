import {getPrisma} from "./prisma";
import {redisCache} from "./cache";
import { P2MSessionData } from "./types";

export const genChannelData = async (channel_type: string, page_id: string) => {
    const prisma = await getPrisma();
    const cacheKey = `FEMTO_${channel_type}_${page_id}`;

    const cachedData = await redisCache.getItem<string>(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const channelData = await prisma.merchantChannel.findMany({
        where: {
            ref_type: channel_type,
            ref_id: page_id,
        },
        include: {
            registries: {
                where: {
                    enabled: true,
                },
                include: {
                    application: {
                        where: {
                            enabled: true,
                        }
                    }
                }
            },
        }
    });

    await redisCache.setItem(cacheKey, JSON.stringify(channelData[0]), {isCachedForever: true});

    return channelData[0];
}

export const verifyApiKey = async(api_key: string) : Promise<boolean> => {
    const prisma = await getPrisma();

    const apiKeyValidation = await prisma.apiKey.count({
        where: { key_content: api_key, enabled: true}
    });
    return apiKeyValidation > 0;
}

export const updateChannelData = async (channel_type: string, page_id: string, token: string) => {
    const prisma = await getPrisma();

    const mutation = await prisma.merchantChannel.updateMany({
        where: {
            ref_type: channel_type,
            ref_id: page_id
        },
        data: {
            token:token
        }
    })
}

export const clearChannelCache =  async (channel_type: string, page_id: string) => {
    const cacheKey = `FEMTO_${channel_type}_${page_id}`;
    await redisCache.setItem(cacheKey,undefined,{ttl:0,isCachedForever: false, isLazy: false})
}

export const genOrderId = async (shop_id: string): Promise<string> => {
    const prisma = await getPrisma();

    const order = await prisma.sequencer.upsert({
        where: {name: shop_id},
        create: {
            name: shop_id,
            data: 1
        },
        update: {
            data: {
                increment: 1
            }
        }
    })

    // Todo: Extract order formatting function to config
    return order.data.toString().padStart(5, '0')
}



export const setCurrentOrderId = async (psid: string, order_id: string, invoice_id: string) => {
    const session: P2MSessionData = {
        order_id: order_id,
        invoice_id: invoice_id
    }

    await redisCache.setItem(`P2M:${psid}`, session, {isCachedForever: true});
}

export const getCurrentOrderId = async (psid: string) => {
    const cachedUsers = await redisCache.getItem<P2MSessionData>(`P2M:${psid}`)
    if (cachedUsers) {
        return cachedUsers
    }

    return {
        order_id: "",
        invoice_id: ""
    }
}