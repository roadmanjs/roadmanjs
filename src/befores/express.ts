import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import {RedisPubSub as PubSub} from 'graphql-redis-subscriptions';
import {graphqlUploadExpress} from 'graphql-upload';
import Redis from 'ioredis';
import _get from 'lodash/get';
import {isEmpty} from 'lodash';
import {RoadmanBuild} from '../shared';

/**
 * First Builder Roadman, #1 my g
 * @param  BeforeRoadmanBuild
 * @returns BeforeRoadmanBuild
 */
export const expressRoadman = async ({app}: RoadmanBuild): Promise<RoadmanBuild> => {
    const redisHost = _get(process.env, 'REDIS_HOST', 'localhost');

    let pubsub: any = null;
    if (!isEmpty(redisHost)) {
        // Create ioredis
        const options = {
            host: redisHost,
            port: 6379,
            retryStrategy: (times: number) => {
                // reconnect after
                return Math.min(times * 50, 2000);
            },
            scope: 'auth-server',
        };
        pubsub = new PubSub({
            publisher: new Redis(options),
            subscriber: new Redis(options),
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
