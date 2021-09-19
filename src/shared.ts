import {ApolloServer} from 'apollo-server-express';
import {NonEmptyArray} from 'type-graphql';
import http from 'http';
import {Application} from 'express';
import {RedisPubSub} from 'graphql-redis-subscriptions';

export interface AfterRoadmanBuild {
    app: Application;
    pubsub: RedisPubSub;
    apolloServer: ApolloServer;
    httpServer: http.Server;
}

export interface BeforeRoadmanBuild {
    app: Application;
    pubsub?: RedisPubSub;
    resolvers?: NonEmptyArray<Function> | NonEmptyArray<string>;
}
