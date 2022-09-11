import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh',
    serverUrl: 'https://beta2.orderbot.jp/',
    apiUrl: 'https://beta2.orderbot.jp/api/'
    // serverUrl: 'http://localhost:3000/',
    // apiUrl: 'http://localhost:3000/api/'
  }
} as Environment;
