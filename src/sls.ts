import 'reflect-metadata';

import {IRoadManSls, RoadmanBuilderSls} from './shared';

import {ExpressRoadmanArgs} from './befores';
import {RoadmanBuilder} from './roadman.builder.sls';

interface IRoadmanDefault {
    resolvers?: Function[];
    roadmen?: IRoadManSls[];
    apps?: any[];
}

export const roadman = (
    args?: IRoadmanDefault,
    expressArgs?: Partial<ExpressRoadmanArgs>
): RoadmanBuilderSls => {
    const {resolvers, roadmen, apps} = args;

    const roadman = new RoadmanBuilder();

    roadman.firstRoadman(expressArgs);

    if (apps) {
        roadman.useApp(apps);
    }

    if (roadmen) {
        roadman.useRoadman(roadmen);
    }

    if (resolvers) {
        // Add basic resolvers
        roadman.useRoadman(async (props) => {
            props.resolvers.push(...resolvers);
            return props;
        });
    }

    roadman.graphqlRoadman(); // to build the schemas

    return roadman;
};

export * from './roadman.builder';
export * from './shared';
export * from './config';
export * from './befores';
export * from './afters';
export * from './wastemans';
