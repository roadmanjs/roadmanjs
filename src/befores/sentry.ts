import * as Sentry from '@sentry/node';
import _get from 'lodash/get';
import {isDev, nodeEnv} from '../config';

// 1. Sentry init
const SENTRY_DSN = _get(process.env, 'SENTRY_DSN', '');

const sentryConfig = {
    dsn: SENTRY_DSN,
    environment: nodeEnv,
    debug: isDev,
};

/**
 * Sentry Builder Roadman
 * @returns
 */
export const sentryRoadman = async <T>(args: T): Promise<T> => {
    if (isDev) {
        return;
    }
    Sentry.init(sentryConfig);
    return args;
};

export const catchError = (e: Error | any) => {
    if (isDev) {
        return;
    }
    console.error(e);
    Sentry.captureException(e);
};

export default sentryRoadman;
