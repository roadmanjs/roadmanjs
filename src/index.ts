import 'reflect-metadata';
import {RoadmanBuilder} from './roadman.builder';
import {IRoadMan} from './shared';

interface IRoadmanDefault {
    resolvers?: Function[];
    roadmen?: IRoadMan[];
    apps?: any[];
}

export const roadman = async (args?: IRoadmanDefault): Promise<boolean> => {
    const {resolvers, roadmen, apps} = args;

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

    return true;
};

export * from './roadman.builder';
export * from './shared';
export * from './config';
export * from './befores';
export * from './afters';
export * from './pengs';
export * from './wastemans';
