export type Environment =
  // The service running in a production cluster available for customers
  | 'production'
  // The service running locally on a development machine
  | 'development'

export type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

export interface Config {
  appVersion: string
  appName: string
  appShortName: string
  environment: Environment
  logLevel: Level
  paginationOptions: number[]
  defaultLocale: string
  apiAddress: string
  useMock: boolean
}

export interface ProcessVariables {
  VITE_APP_VERSION?: string
  VITE_APP_ENV?: Environment
  VITE_APP_NAME?: string
  VITE_APP_SHORT_NAME?: string
  VITE_APP_API_ADDRESS?: string
  VITE_APP_USE_MOCK?: boolean
}
