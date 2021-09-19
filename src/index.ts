import {RoadmanBuilder} from './roadman.builder';

interface IRoadmanDefault {
    resolvers?: Function[];
    roadmen?: any[];
}
export const roadManStart = async ({
    resolvers,
    roadmen,
}: Partial<IRoadmanDefault>): Promise<boolean> => {
    const roadman = new RoadmanBuilder();

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

    // call all befores
    // add all the middlewares
    // run all
    // Add all the afters

    return true;
};
