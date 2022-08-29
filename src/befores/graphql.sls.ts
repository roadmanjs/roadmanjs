import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

/* eslint-disable @typescript-eslint/ban-ts-comment */
import {ApolloServer} from 'apollo-server-lambda';
import {RoadmanBuilderSls} from '../shared';
import {buildSchemaSync} from 'type-graphql';
import {isDev} from '../config';

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
        introspection: isDev, // enables introspection of the schema
        csrfPrevention: true,
        cache: 'bounded',
        // playground: true, // enables the actual playground
        // uploads: false,
    });

    return {
        app,
        apolloServer,
    };
};
