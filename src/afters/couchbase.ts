import 'reflect-metadata';
import 'dotenv/config';
import chalk from 'chalk';
import {PORT, log} from '../config';
import {startCouchbase} from '../database';
import {RoadmanBuild} from '../shared';
import awaitTo from '../utils/awaitTo';

/**
 * An example of a last RoadMan
 * @param RoadmanBuild
 */
export const couchbaseRoadman = async ({httpServer, pubsub}: RoadmanBuild): Promise<void> => {
    const [errorStarting, started] = await awaitTo(startCouchbase());

    if (started) {
        httpServer.listen(Number(PORT), () => {
            log(chalk.green(`Server started on port ${PORT}, Redis=${pubsub ? true : false}`));
            log(chalk.rgb(255, 100, 200)(`GraphQL API at http://localhost:${PORT}/graphql`));
        });
    }

    if (errorStarting) {
        log(chalk.red(`Error starting Couchbase on port ${PORT}, Redis=${pubsub ? true : false}`));
        console.error(errorStarting);
        process.exit(1);
    }
};
