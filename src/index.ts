import 'reflect-metadata';

import {IRoadMan} from './shared';
import {RoadmanBuilder} from './roadman.builder';
import isEmpty from 'lodash/isEmpty';

interface IRoadmanDefault {
    resolvers?: Function[];
    roadmen?: IRoadMan[];
    apps?: any[];
    wastemen?: Promise<any>[];
}

export const roadman = async (args?: IRoadmanDefault): Promise<boolean> => {
    const {resolvers, roadmen, apps, wastemen} = args;

    const roadman = new RoadmanBuilder();

    await roadman.firstRoadman();

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

    await roadman.graphqlRoadman(); // to build the schemas
    await roadman.lastRoadman(); // to start the db and the server

    if (!isEmpty(wastemen)) {
        roadman.runWastemans(wastemen);
    }

    return true;
};

export * from './roadman.builder';
export * from './shared';
export * from './config';
export * from './befores';
export * from './afters';
export * from './wastemans';
