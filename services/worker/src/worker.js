const assert = require("assert");
const RSMQPromise = require("rsmq-promise-native");
const { pipe, tap, switchCase, tryCatch, eq, get } = require("rubico");
const { includes } = require("rubico/x");

const config = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 7379,
  qname: "queue-2",
  realtime: true,
};

const readMessages = async ({ rsmq, config: { qname } }) => {
  do {
    await tryCatch(
      pipe([
        tap(() => {
          console.log(`receiveMessage from queue '${qname}'`);
        }),
        () => rsmq.receiveMessage({ qname }),
        tap((message) => {
          assert(true);
        }),
        (message) => {},
      ]),
      (error) => {
        throw error;
      }
    )();
  } while (true);
};

const createQueue = ({ rsmq, config: { qname } }) =>
  tryCatch(
    pipe([
      tap(() => {
        console.log(`creating queue '${qname}'`);
      }),
      () => rsmq.listQueues(),
      tap((queues) => {
        console.log(`queues: '${queues}'`);
      }),
      switchCase([
        includes(qname),
        () => {
          console.log(`queue '${qname}' already created`);
        },
        pipe([
          () => rsmq.createQueue({ qname }),
          tap(() => {
            console.log(`queue '${qname}' created`);
          }),
        ]),
      ]),
    ]),
    (error) => {
      throw error;
    }
  )();

exports.main = () =>
  pipe([
    () => new RSMQPromise(config),
    (rsmq) =>
      pipe([
        () => createQueue({ rsmq, config }),
        () => readMessages({ rsmq, config }),
      ])(),
  ])();
