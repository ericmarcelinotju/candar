import { Config, Environment, ProcessVariables } from './config.type'

export const config = getConfig(process.env as unknown as ProcessVariables)

export function getConfig (processVariables: ProcessVariables): Config {
  const environment: Environment = processVariables.VITE_ENV || 'local'

  return {
    appVersion: processVariables.VITE_APP_VERSION,
    appName: processVariables.VITE_APP_NAME,
    appShortName: processVariables.VITE_APP_NAME,
    environment: environment,
    logLevel: processVariables.VITE_LOG_LEVEL ?? 'debug',
    paginationOptions: [10, 25, 50, 100, 500],
    aboutUrl: processVariables.VITE_ABOUT_URL,
    defaultLocale: 'en',
    apiAddress: processVariables.VITE_API_ADDRESS,
    useMock: processVariables.VITE_USE_MOCK
  }
}
