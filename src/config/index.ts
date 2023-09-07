import { Config, Environment, ProcessVariables } from './config.type'

export const config = getConfig(process.env as unknown as ProcessVariables)

export function getConfig(processVariables: ProcessVariables): Config {
  const environment: Environment =
    processVariables.VITE_APP_ENV || 'development'

  return {
    appVersion: processVariables.VITE_APP_VERSION,
    appName: processVariables.VITE_APP_NAME,
    appShortName: processVariables.VITE_APP_NAME,
    environment: environment,
    logLevel: environment === 'development' ? 'debug' : 'info',
    paginationOptions: [10, 25, 50, 100, 500],
    defaultLocale: 'en',
    apiAddress: processVariables.VITE_APP_API_ADDRESS,
    useMock: processVariables.VITE_APP_USE_MOCK
  }
}
