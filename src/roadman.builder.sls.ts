import {IRoadManSls, RoadmanBuilderSls} from './shared';
import express, {Application} from 'express';

import {ApolloServer} from 'apollo-server-lambda';
import {ExpressRoadmanArgs} from './befores';
import {expressRoadman} from './befores/express.sls';
import {graphQLRoadman} from './befores/graphql.sls';
import {isEmpty} from 'lodash';

/**
 * The Roadman Builder
 * const roadman = new RoadmanBuilder(app);
 * roadman.useRoadman(myCoolRoadman);
 * roadman.useApp(path, handler);
 * Build all the roadmen
 * roadman.build();
 */
export class RoadmanBuilder implements RoadmanBuilderSls {
    app: Application;
    apolloServer: ApolloServer;
    resolvers = [];

    constructor(app?: Application, roadmen?: IRoadManSls[]) {
        this.app = app ? app : express();
        // sentryRoadman(this); // first

        if (!isEmpty(roadmen)) {
            for (const roadman of roadmen) {
                roadman(this);
            }
        }
    }

    async firstRoadman(expressArgs?: ExpressRoadmanArgs): Promise<RoadmanBuilderSls> {
        const {app} = expressRoadman(this, expressArgs);

        this.app = app;

        return this;
    }

    useApp(use: any | any[]): RoadmanBuilder {
        if (Array.isArray(use)) {
            if (!isEmpty(use)) {
                for (const app of use) {
                    this.app.use(app);
                }
            }
        } else {
            this.app.use(use);
        }

        return this;
    }

    useRoadman(roadman: IRoadManSls | IRoadManSls[]): RoadmanBuilderSls {
        if (Array.isArray(roadman)) {
            if (!isEmpty(roadman)) {
                for (const road of roadman) {
                    road(this);
                }
            }
        } else {
            roadman(this);
        }

        return this;
    }

    async graphqlRoadman(): Promise<RoadmanBuilder> {
        const {apolloServer} = graphQLRoadman(this);
        this.apolloServer = apolloServer;
        return this;
    }
}
