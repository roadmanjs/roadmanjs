import 'dotenv/config';
import _get from 'lodash/get';
// Service account
export const serviceAccount = _get(process.env, 'SA_KEY', '{}');
export const nodeEnv = _get(process.env, 'NODE_ENV');
export const isDev = nodeEnv !== 'production';
export const PORT: number = +_get(process.env, 'PORT', 3099);

export const demoToken = 'mytokengenerastor';
export const graphqlPath = '/graphql';
