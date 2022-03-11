import {Application, Request, Response} from 'express';

import {ApolloServer} from 'apollo-server-express';
import {RedisPubSub} from 'graphql-redis-subscriptions';
import http from 'http';

export interface ContextType {
    req: Request;
    res: Response;
    payload?: any;
    pubsub?: RedisPubSub;
}

export interface RoadmanBuild {
    app: Application;
    pubsub?: RedisPubSub;
    apolloServer?: ApolloServer;
    httpServer?: http.Server;
    resolvers?: Function[];
}

export type IRoadMan = (args: RoadmanBuild) => Promise<RoadmanBuild>;
