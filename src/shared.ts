import {ApolloServer} from 'apollo-server-express';
import {NonEmptyArray} from 'type-graphql';
import http from 'http';
import {Application} from 'express';
import {RedisPubSub} from 'graphql-redis-subscriptions';

export interface RoadmanBuild {
    app: Application;
    pubsub?: RedisPubSub;
    apolloServer?: ApolloServer;
    httpServer?: http.Server;
    resolvers?: NonEmptyArray<Function> | NonEmptyArray<string>;
}

export type IRoadMan = (args: RoadmanBuild) => Promise<RoadmanBuild>;
