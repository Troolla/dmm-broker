import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh',
    serverUrl: 'https://fjh.orderbot.jp/',
    apiUrl: 'https://fjh.orderbot.jp/api/'
  }
} as Environment;
