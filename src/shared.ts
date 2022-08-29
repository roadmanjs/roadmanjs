import {Application, Request, Response} from 'express';

import {ApolloServer} from 'apollo-server-express';
import {ApolloServer as ApolloServerSls} from 'apollo-server-lambda';
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

export interface RoadmanBuilderSls {
    app: Application;
    apolloServer?: ApolloServerSls;
    resolvers?: Function[];
}

export type IRoadManSls = (args: RoadmanBuilderSls) => Promise<RoadmanBuilderSls>;
export type IRoadMan = (args: RoadmanBuild) => Promise<RoadmanBuild>;
