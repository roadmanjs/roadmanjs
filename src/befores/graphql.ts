import {ApolloServer} from 'apollo-server-express';
import {buildSchemaSync, NonEmptyArray} from 'type-graphql';
import http from 'http';
import {graphqlPath} from '../config';
import {Application} from 'express';
import {RedisPubSub} from 'graphql-redis-subscriptions';

interface BuiltGraphQLServer {
    app: Application;
    pubsub: RedisPubSub;
    apolloServer: ApolloServer;
    httpServer: http.Server;
}

interface BuildGraphQL {
    app: Application;
    pubsub: RedisPubSub;
    resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
}

export const buildGraphQL = async ({
    app,
    pubsub,
    resolvers,
}: BuildGraphQL): Promise<BuiltGraphQLServer> => {
    const schema = pubsub
        ? buildSchemaSync({
              resolvers,
              pubSub: pubsub,
          })
        : buildSchemaSync({
              resolvers,
          });

    // build apollo server
    const apolloServer = new ApolloServer({
        schema,
        subscriptions: {
            onConnect() {},
            onDisconnect() {},
        },
        introspection: true, // enables introspection of the schema
        playground: true, // enables the actual playground
        context: ({req, res}) => ({req, res, pubsub}),
        uploads: false,
    });

    apolloServer.applyMiddleware({
        app,
        path: graphqlPath,
        cors: {origin: '*'},
    });

    // Create  HTTP server and run
    const httpServer = http.createServer(app);

    if (pubsub) {
        apolloServer.installSubscriptionHandlers(httpServer);
    }

    return {
        app,
        apolloServer,
        httpServer,
        pubsub,
    };
};
