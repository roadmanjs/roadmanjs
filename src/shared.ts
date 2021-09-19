import {ApolloServer} from 'apollo-server-express';
import http from 'http';
import {Application, Request, Response} from 'express';
import {RedisPubSub} from 'graphql-redis-subscriptions';

export interface ContextType {
    req: Request;
    res: Response;
    payload?: any;
    pubsub: RedisPubSub;
}

export interface RoadmanBuild {
    app: Application;
    pubsub?: RedisPubSub;
    apolloServer?: ApolloServer;
    httpServer?: http.Server;
    resolvers?: Function[];
}

export type IRoadMan = (args: RoadmanBuild) => Promise<RoadmanBuild>;
