import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import {graphqlPath, isDev} from '../config';

/* eslint-disable @typescript-eslint/ban-ts-comment */
import {ApolloServer} from 'apollo-server-lambda';
import {RoadmanBuilderSls} from '../shared';
import {buildSchemaSync} from 'type-graphql';

/**
 * The last Builder Roadman
 * @param BeforeRoadmanBuild
 * @returns AfterRoadmanBuild
 */
export const graphQLRoadman = ({app, resolvers}: RoadmanBuilderSls): RoadmanBuilderSls => {
    // Schema
    const schema = buildSchemaSync({
        // @ts-ignore
        resolvers,
        skipCheck: true,
    });

    // Build apollo server
    const apolloServer = new ApolloServer({
        schema,
        plugins: [
            !isDev
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        introspection: true, // enables introspection of the schema
        csrfPrevention: true,
        cache: 'bounded',
        // playground: true, // enables the actual playground
        // uploads: false,
    });

    apolloServer.applyMiddleware({
        app,
        path: graphqlPath,
        cors: {origin: '*'},
    });

    return {
        app,
        apolloServer,
    };
};
