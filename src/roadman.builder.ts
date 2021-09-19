import {ApolloServer} from 'apollo-server-express';
import express, {Application} from 'express';
import {RedisPubSub} from 'graphql-redis-subscriptions';
import {Server} from 'http';
import {couchbaseRoadman} from './afters/couchbase';
import {expressRoadman} from './befores/express';
import {RoadmanBuild, IRoadMan} from './shared';

export class RoadmanBuilder implements RoadmanBuild {
    app: Application;
    pubsub: RedisPubSub;
    apolloServer: ApolloServer;
    httpServer: Server;

    constructor(app?: Application) {
        this.app = app ? app : express();
    }

    firstRoadman(roadman: IRoadMan): RoadmanBuilder {
        const mandem = roadman || expressRoadman;

        mandem({app: this.app}).then(({app, pubsub}) => {
            this.app = app;
            this.pubsub = pubsub;
        });

        return this;
    }

    useApp(use: any): RoadmanBuilder {
        this.app.use(use);
        return this;
    }

    lastRoadman(roadman: IRoadMan): RoadmanBuilder {
        const mandem = roadman || couchbaseRoadman;

        mandem({
            app: this.app,
            pubsub: this.pubsub,
            apolloServer: this.apolloServer,
            httpServer: this.httpServer,
        }).then(() => {});

        return this;
    }
}
