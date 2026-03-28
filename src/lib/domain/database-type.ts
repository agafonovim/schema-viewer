export enum DatabaseType {
    GENERIC = 'generic',
    POSTGRESQL = 'postgresql',
    MYSQL = 'mysql',
    SQL_SERVER = 'sql_server',
    MARIADB = 'mariadb',
    SQLITE = 'sqlite',
    CLICKHOUSE = 'clickhouse',
    COCKROACHDB = 'cockroachdb',
    ORACLE = 'oracle',
}

const databaseTypeValues = new Set<string>(Object.values(DatabaseType));

export function parseDatabaseType(value: string | null): DatabaseType {
    if (!value) return DatabaseType.GENERIC;
    const lower = value.toLowerCase();
    return databaseTypeValues.has(lower)
        ? (lower as DatabaseType)
        : DatabaseType.GENERIC;
}
