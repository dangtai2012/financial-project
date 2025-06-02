export interface IDatabaseConfig {
  dbType: string;
  dbHost: string;
  dbPort: number;
  dbUsername: string;
  dbPassword: string;
  dbDatabase: string;
  dbSynchronize: boolean;
  dbLogging: boolean;
}
