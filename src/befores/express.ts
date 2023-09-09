import {REDIS_HOST, REDIS_PASS, REDIS_PORT, REDIS_TLS, REDIS_URL} from '../config';
import Redis, {RedisOptions} from 'ioredis';

import {RedisPubSub as PubSub} from 'graphql-redis-subscriptions';
import {RoadmanBuild} from '../shared';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import {isEmpty} from 'lodash';

export interface ExpressRoadmanArgs {
    limit?: string; // 5mp
    maxFileSize?: number; // 10000000,
    maxFiles?: number; // 10
    defaultIndex?: boolean;
}

/**
 * First Builder Roadman, #1 my g
 * @param  BeforeRoadmanBuild
 * @returns BeforeRoadmanBuild
 */
export const expressRoadman = async (
    {app}: RoadmanBuild,
    args?: ExpressRoadmanArgs
): Promise<RoadmanBuild> => {
    const {defaultIndex = true} = args || {};

    const isRedisUrl = !isEmpty(REDIS_URL);
    const isRedisHost = !isEmpty(REDIS_HOST);

    let pubsub: PubSub = null;
    if (isRedisHost || isRedisUrl) {
        // Create ioredis
        const options: RedisOptions | string = isRedisUrl
            ? REDIS_URL
            : {
                  host: REDIS_HOST,
                  port: +REDIS_PORT,
                  retryStrategy: (times: number) => {
                      // reconnect after
                      return Math.min(times * 50, 2000);
                  },
                  tls: REDIS_TLS
                      ? {
                            host: REDIS_HOST,
                            port: +REDIS_PORT,
                        }
                      : undefined,
                  password: REDIS_PASS,
                  connectTimeout: 10000,
              };

        pubsub = new PubSub({
            publisher: new Redis(options as any),
            subscriber: new Redis(options as any),
        });
    }

    app.use(
        cors({
            origin: '*',
            credentials: true,
        })
    );

    app.use(cookieParser());

    app.use((req: any, res: any, next: any) => {
        req.pubsub = pubsub;
        next();
    });

    if (defaultIndex) {
        app.get('/', (_, res) => {
            res.send('hello');
        });
    }

    // Create  HTTP server
    const httpServer = http.createServer(app);

    return {app, pubsub, httpServer};
};

export default expressRoadman;
