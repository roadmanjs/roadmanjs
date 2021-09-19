import {RoadmanBuilder} from './roadman.builder';
import {IRoadMan} from './shared';

interface IRoadmanDefault {
    resolvers?: Function[];
    roadmen?: IRoadMan[];
    apps?: any[];
}

export const roadManStart = async ({
    resolvers,
    roadmen,
    apps,
}: Partial<IRoadmanDefault>): Promise<boolean> => {
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

    await roadman.lastRoadman();

    return true;
};
