import {REDIS_HOST, REDIS_PASS, REDIS_PORT, REDIS_TLS, REDIS_URL} from '../config';
import Redis, {RedisOptions} from 'ioredis';
import express, {json} from 'express';

import {RedisPubSub as PubSub} from 'graphql-redis-subscriptions';
import {RoadmanBuild} from '../shared';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import http from 'http';
import includes from 'lodash/includes';
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
    const {limit = '5mb', maxFileSize = 10000000, maxFiles = 10, defaultIndex = true} = args || {};

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

    // Use JSON parser for all non-webhook routes
    app.use((req, res, next) => {
        const isWebHook = includes(req.originalUrl, 'webhook');
        if (isWebHook) {
            next();
        } else {
            json({limit})(req, res, next);
        }
    });

    // app.use(json({limit}));

    app.use(
        cors({
            origin: '*',
            credentials: true,
        })
    );

    app.use(cookieParser());
    app.use(express.urlencoded({extended: true}));

    app.use((req: any, res: any, next: any) => {
        req.pubsub = pubsub;
        next();
    });

    if (defaultIndex) {
        app.get('/', (_, res) => {
            res.send('hello');
        });
    }

    app.use(graphqlUploadExpress({maxFileSize, maxFiles}));

    // Create  HTTP server
    const httpServer = http.createServer(app);

    return {app, pubsub, httpServer};
};

export default expressRoadman;
