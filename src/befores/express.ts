import Redis, {RedisOptions} from 'ioredis';

import {RedisPubSub as PubSub} from 'graphql-redis-subscriptions';
import {RoadmanBuild} from '../shared';
import _get from 'lodash/get';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import {graphqlUploadExpress} from 'graphql-upload';
import {isEmpty} from 'lodash';

/**
 * First Builder Roadman, #1 my g
 * @param  BeforeRoadmanBuild
 * @returns BeforeRoadmanBuild
 */
export const expressRoadman = async ({app}: RoadmanBuild): Promise<RoadmanBuild> => {
    const redisUrl = _get(process.env, 'REDIS_URL', '');
    const redisHost = _get(process.env, 'REDIS_HOST', '');

    const isRedisUrl = !isEmpty(redisUrl);
    const isRedisHost = !isEmpty(redisHost);

    let pubsub: any = null;
    if (isRedisHost) {
        const redisTls = !isEmpty(_get(process.env, 'REDIS_TLS', ''));
        const redisPort = _get(process.env, 'REDIS_PORT', 6379);
        const redisPass = _get(process.env, 'REDIS_PASS', undefined);

        // Create ioredis
        const options: RedisOptions | string = isRedisUrl
            ? redisUrl
            : {
                  host: redisHost,
                  port: +redisPort,
                  retryStrategy: (times: number) => {
                      // reconnect after
                      return Math.min(times * 50, 2000);
                  },
                  tls: redisTls
                      ? {
                            host: redisHost,
                            port: +redisPort,
                        }
                      : undefined,
                  password: redisPass,
                  connectTimeout: 10000,
              };
        pubsub = new PubSub({
            publisher: new Redis(options as any),
            subscriber: new Redis(options as any),
        });
    }

    app.use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}));

    app.use(
        cors({
            origin: '*',
            credentials: true,
        })
    );

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use((req: any, res: any, next: any) => {
        req.pubsub = pubsub;
        next();
    });

    app.get('/', (_, res) => {
        res.send('hello');
    });

    return {app, pubsub};
};

export default expressRoadman;
