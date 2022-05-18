import 'dotenv/config';

import _get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

// Service account
export const serviceAccount = _get(process.env, 'SA_KEY', '{}');
export const nodeEnv = _get(process.env, 'NODE_ENV');
export const isDev = nodeEnv !== 'production';
export const PORT: number = +_get(process.env, 'PORT', 3099);

// this
export const REDIS_URL = _get(process.env, 'REDIS_URL', '');

// or this
export const REDIS_HOST = _get(process.env, 'REDIS_HOST', '');
export const REDIS_TLS = !isEmpty(_get(process.env, 'REDIS_TLS', ''));
export const REDIS_PORT = _get(process.env, 'REDIS_PORT', 6379);
export const REDIS_PASS = _get(process.env, 'REDIS_PASS', undefined);

export const demoToken = 'mytokengenerastor';
export const graphqlPath = '/graphql';
