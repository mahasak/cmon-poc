import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import { redisClient } from "./utils/cache";
import { changeHook, messageHook, postbackHook } from './service/hpp/webhook';
import { ChangesEvent, MessagingEvent, WebhookEvent } from './utils/types';

const app: Express = express();
const port = process.env.SERVER_PORT ?? 8082;
const topic = process.env.REDIS_TOPIC_NAME ?? "";

export interface WebhookEntry {
  id: string;
  time: number;
  messaging?: any;
  changes?: any;
}


export interface WrappedMessage {
  traceId: string;
  pageEntry: WebhookEntry;
}

console.log(topic)
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send(`Femto HPP Server`);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);

  (async () => {
    const subscriber = redisClient.duplicate();
    subscriber.on("message", function (channel, topicMessage) {
      console.log("test}")
      console.log("Message: " + topicMessage + " on channel: " + channel + " is arrive!");
      if (topicMessage && topicMessage !== "") {
        try {
          console.log(topicMessage);
          const pageEntry: WebhookEvent = JSON.parse(topicMessage);
          console.log('===============================')
          console.log(pageEntry)
          console.log(pageEntry)

          pageEntry.entry.forEach(async function (entry: WebhookEntry) {
            console.log(entry);
            if (entry.messaging) {
              const messaging = entry.messaging;
              console.log('messaging', messaging)
              messaging.forEach(async (message: any) => {
                await processWebhookMessages(message);
              });
            }

            if (entry.changes) {
              entry.changes.forEach(async function (changes: ChangesEvent) {
                await changeHook(changes);
              });
            }
          });
        } catch (error) {
          console.log("error")
          console.log(error)
        }
      }
    });

    await subscriber.subscribe(topic, (topicMessage) => {
      if (topicMessage !== null && topicMessage !== undefined) {
        console.log(topicMessage);
      }
    });
  })();
});

export const processWebhookMessages = async (event: MessagingEvent) => {
  console.log(event);
  if (event.message) {
    console.log('message received')
    await receivedMessage(event)
  } else if (event.postback) {
    console.log('postback received')
    await postbackHook(event);
  } else {
    console.log(`Unable to process received messagingEvent: ${event}`)
  }
}

export const receivedMessage = async (event: MessagingEvent) => {
  if (event.message?.text) {
    await messageHook(event);
  }
}
