import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import {execute, subscribe} from 'graphql';
import express, {json} from 'express';
import {graphqlPath, isDev} from '../config';

/* eslint-disable @typescript-eslint/ban-ts-comment */
import {ApolloServer} from 'apollo-server-express';
import {ExpressRoadmanArgs} from './express';
import {RoadmanBuild} from '../shared';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {buildSchemaSync} from 'type-graphql';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import includes from 'lodash/includes';

/**
 * The last Builder Roadman
 * @param BeforeRoadmanBuild
 * @returns AfterRoadmanBuild
 */
export const graphQLRoadman = async (
    {app, pubsub, resolvers, httpServer}: RoadmanBuild,
    args?: ExpressRoadmanArgs
): Promise<RoadmanBuild> => {
    const {maxFileSize = 10000000, maxFiles = 10, limit = '5mb'} = args || {};

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
        csrfPrevention: false,
        allowBatchedHttpRequests: true, // enables
    });

    await apolloServer.start();

    app.use(graphqlUploadExpress({maxFileSize, maxFiles}));

    app.use(
        cors({
            origin: '*',
            credentials: true,
        })
    );

    app.use(cookieParser());

    // Use JSON parser for all non-webhook routes
    app.use((req, res, next) => {
        const isWebHook = includes(req.originalUrl, 'webhook');
        if (isWebHook) {
            next();
        } else {
            json({limit})(req, res, next);
        }
    });
    app.use(express.urlencoded({extended: true}));

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
