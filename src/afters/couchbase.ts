import 'reflect-metadata';
import 'dotenv/config';
import chalk from 'chalk';
import {PORT, log} from '../config';
import {startCouchbase} from '../database';
import {RoadmanBuild} from '../shared';

/**
 * An example of a last RoadMan
 * @param RoadmanBuild
 */
export const couchbaseRoadman = async ({httpServer, pubsub}: RoadmanBuild): Promise<void> => {
    startCouchbase()
        .then(() => {
            httpServer.listen(Number(PORT), () => {
                log(chalk.green(`Server started on port ${PORT}, Redis=${pubsub ? true : false}`));
            });
        })
        .catch((error) => {
            log(
                chalk.red(
                    `Error starting Couchbase on port ${PORT}, Redis=${pubsub ? true : false}`
                )
            );
            console.error(error);
            process.exit(1);
        });
};
