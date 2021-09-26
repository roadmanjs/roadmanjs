import 'reflect-metadata';
import 'dotenv/config';
import chalk from 'chalk';
import {PORT, log} from '../config';
import {RoadmanBuild} from '../shared';

/**
 * A roadman to start the HTTP server
 * @param RoadmanBuild
 */
export const listenRoadman = async ({httpServer, pubsub}: RoadmanBuild): Promise<void> => {
    httpServer.listen(Number(PORT), () => {
        log(chalk.green(`Server started on port ${PORT}, Redis=${pubsub ? true : false}`));
        log(chalk.rgb(255, 100, 200)(`GraphQL API at http://localhost:${PORT}/graphql`));
    });
};
