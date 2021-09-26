import {ApolloServer} from 'apollo-server-express';
import express, {Application} from 'express';
import {RedisPubSub} from 'graphql-redis-subscriptions';
import {Server} from 'http';
import {isEmpty} from 'lodash';
import {listenRoadman} from './afters';
import {expressRoadman, graphQLRoadman} from './befores';
import {RoadmanBuild, IRoadMan} from './shared';

/**
 * The Roadman Builder
 * const roadman = new RoadmanBuilder(app);
 * roadman.useRoadman(myCoolRoadman);
 * roadman.useApp(path, handler);
 * Build all the roadmen
 * roadman.build();
 */
export class RoadmanBuilder implements RoadmanBuild {
    app: Application;
    pubsub: RedisPubSub;
    apolloServer: ApolloServer;
    httpServer: Server;
    resolvers = [];

    constructor(app?: Application, roadmen?: IRoadMan[]) {
        this.app = app ? app : express();
        // sentryRoadman(this); // first

        if (!isEmpty(roadmen)) {
            for (const roadman of roadmen) {
                roadman(this);
            }
        }
    }

    async firstRoadman(roadman?: IRoadMan): Promise<RoadmanBuilder> {
        const mandem = roadman || expressRoadman;

        const {app, pubsub} = await mandem(this);

        this.app = app;
        this.pubsub = pubsub;

        return this;
    }

    useApp(use: any | any[]): RoadmanBuilder {
        if (Array.isArray(use)) {
            if (!isEmpty(use)) {
                for (const app of use) {
                    this.app.use(app);
                }
            }
        } else {
            this.app.use(use);
        }

        return this;
    }

    async useRoadman(roadman: IRoadMan | IRoadMan[]): Promise<RoadmanBuilder> {
        if (Array.isArray(roadman)) {
            if (!isEmpty(roadman)) {
                for (const road of roadman) {
                    await road(this);
                }
            }
        } else {
            await roadman(this);
        }

        return this;
    }

    async graphqlRoadman(roadman?: IRoadMan): Promise<RoadmanBuilder> {
        const mandem = roadman || graphQLRoadman;

        const {apolloServer, httpServer} = await mandem(this);
        this.apolloServer = apolloServer;
        this.httpServer = httpServer;

        return this;
    }

    async lastRoadman(roadman?: IRoadMan): Promise<RoadmanBuilder> {
        const mandem = roadman || listenRoadman;

        await mandem(this);

        return this;
    }
}
