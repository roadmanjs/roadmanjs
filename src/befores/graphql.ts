import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import {execute, subscribe} from 'graphql';
import {graphqlPath, isDev} from '../config';

/* eslint-disable @typescript-eslint/ban-ts-comment */
import {ApolloServer} from 'apollo-server-express';
import {RoadmanBuild} from '../shared';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {buildSchemaSync} from 'type-graphql';
import http from 'http';

/**
 * The last Builder Roadman
 * @param BeforeRoadmanBuild
 * @returns AfterRoadmanBuild
 */
export const graphQLRoadman = async ({
    app,
    pubsub,
    resolvers,
}: RoadmanBuild): Promise<RoadmanBuild> => {
    // Schema
    const schema = pubsub
        ? buildSchemaSync({
              // @ts-ignore
              resolvers,
              pubSub: pubsub,
              skipCheck: true,
          })
        : buildSchemaSync({
              // @ts-ignore
              resolvers,
              skipCheck: true,
          });

    // Create  HTTP server and run
    const httpServer = http.createServer(app);

    const subscriptionServer = SubscriptionServer.create(
        {schema, execute, subscribe},
        {server: httpServer, path: graphqlPath}
    );

    // Build apollo server
    const apolloServer = new ApolloServer({
        schema,
        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subscriptionServer.close();
                        },
                    };
                },
            },
            !isDev
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        introspection: true, // enables introspection of the schema
        // playground: true, // enables the actual playground
        context: ({req, res}) => ({req, res, pubsub}),
        // uploads: false,
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        path: graphqlPath,
        cors: {origin: '*'},
    });

    return {
        app,
        apolloServer,
        httpServer,
        pubsub,
    };
};
