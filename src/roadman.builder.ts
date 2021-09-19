import {ApolloServer} from 'apollo-server-express';
import express, {Application} from 'express';
import {RedisPubSub} from 'graphql-redis-subscriptions';
import {Server} from 'http';
import {isEmpty} from 'lodash';
import {couchbaseRoadman} from './afters';
import {expressRoadman, graphQLRoadman, sentryRoadman} from './befores';
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
        sentryRoadman(this); // first

        if (!isEmpty(roadmen)) {
            for (const roadman of roadmen) {
                roadman(this);
            }
        }
    }

    firstRoadman(roadman?: IRoadMan): RoadmanBuilder {
        const mandem = roadman || expressRoadman;

        mandem(this).then(({app, pubsub}) => {
            this.app = app;
            this.pubsub = pubsub;
        });

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

    useRoadman(roadman: IRoadMan | IRoadMan[]): RoadmanBuilder {
        if (Array.isArray(roadman)) {
            if (!isEmpty(roadman)) {
                for (const road of roadman) {
                    road(this);
                }
            }
        } else {
            roadman(this);
        }

        return this;
    }

    graphqlRoadman(roadman?: IRoadMan): RoadmanBuilder {
        const mandem = roadman || graphQLRoadman;

        mandem(this).then(() => {});

        return this;
    }

    lastRoadman(roadman?: IRoadMan): RoadmanBuilder {
        const mandem = roadman || couchbaseRoadman;

        mandem(this).then(() => {});

        return this;
    }
}
