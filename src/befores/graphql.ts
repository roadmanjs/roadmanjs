/* eslint-disable @typescript-eslint/ban-ts-comment */
import {ApolloServer} from 'apollo-server-express';
import {RoadmanBuild} from '../shared';
import {buildSchemaSync} from 'type-graphql';
import {graphqlPath} from '../config';
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
