import express, {json} from 'express';

import {ExpressRoadmanArgs} from './express';
import {RoadmanBuilderSls} from '../shared';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

/**
 * First Builder Roadman, #1 my g
 * @param  BeforeRoadmanBuild
 * @returns BeforeRoadmanBuild
 */
export const expressRoadman = (
    {app}: RoadmanBuilderSls,
    args?: ExpressRoadmanArgs
): RoadmanBuilderSls => {
    const {limit = '5mb', maxFileSize = 10000000, maxFiles = 10, defaultIndex = true} = args || {};

    app.use(json({limit}));
    app.use(graphqlUploadExpress({maxFileSize, maxFiles}));

    app.use(
        cors({
            origin: '*',
            credentials: true,
        })
    );

    app.use(cookieParser());
    app.use(express.urlencoded({extended: true}));

    if (defaultIndex) {
        app.get('/', (_, res) => {
            res.send('hello');
        });
    }

    return {app};
};

export default expressRoadman;
