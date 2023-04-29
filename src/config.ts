interface migrationOptions {
  schema?: {
    default: string
    clone: string
    reference: string
  }
  database?: {
    default: string
    reference: string
  }
  deploy: {
    tmpFile: string
    undeployFile: string
  }
  migrations?: {
    path: string
  },
  scripts?: {
    before?: string
    after?: string
  }
}

interface serviceOptions {
  name: string
  kind?: string
  label?: string
  dialect?: string
  model: string[]
  tags?: string[]
  impl?: string
  credentials: {
    host?: string
    hostname?: string
    port?: number
    database?: string
    dbname?: string
    user?: string
    username?: string
    password?: string
    sslcert?: string
    sslrootcert?: string
  }
}

interface liquibaseOptions {
  liquibase?: string
  changeLogFile?: string
  url?: string
  username?: string
  password?: string
  classpath?: string
  defaultSchemaName?: string
  referenceUrl?: string
  referenceUsername?: string
  referencePassword?: string
  referenceDefaultSchemaName?: string
  outputFile?: string
  driver?: string
}

interface configOptions {
  service: serviceOptions
  migrations: migrationOptions
}

const config = async (service: string): Promise<configOptions> => {
  await cds.connect()


  /* Below code block for solve `[cds-dbm] - failed to load model undefined` issue. */
  const _serviceOptions = cds.env.requires[service];
  const _dbInfo = _serviceOptions.kind ? _serviceOptions.kind : {};
  const serviceOptions = {..._serviceOptions, ...cds.env.requires[_dbInfo]};
  /* end */
  
  // @ts-ignore
  const migrationOptions = cds.env.migrations[service]
  
  return {
    migrations: migrationOptions,
    service: serviceOptions,
  }
}

export { configOptions, liquibaseOptions, migrationOptions, config }
