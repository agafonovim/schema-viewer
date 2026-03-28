import { describe, it, expect } from 'vitest';
import { DatabaseType, parseDatabaseType } from '../database-type';

describe('parseDatabaseType', () => {
    it('should return GENERIC for null', () => {
        expect(parseDatabaseType(null)).toBe(DatabaseType.GENERIC);
    });

    it('should return GENERIC for empty string', () => {
        expect(parseDatabaseType('')).toBe(DatabaseType.GENERIC);
    });

    it('should return GENERIC for unknown value', () => {
        expect(parseDatabaseType('mongodb')).toBe(DatabaseType.GENERIC);
        expect(parseDatabaseType('redis')).toBe(DatabaseType.GENERIC);
    });

    it.each([
        ['postgresql', DatabaseType.POSTGRESQL],
        ['mysql', DatabaseType.MYSQL],
        ['sql_server', DatabaseType.SQL_SERVER],
        ['mariadb', DatabaseType.MARIADB],
        ['sqlite', DatabaseType.SQLITE],
        ['clickhouse', DatabaseType.CLICKHOUSE],
        ['cockroachdb', DatabaseType.COCKROACHDB],
        ['oracle', DatabaseType.ORACLE],
        ['generic', DatabaseType.GENERIC],
    ])('should parse "%s" correctly', (input, expected) => {
        expect(parseDatabaseType(input)).toBe(expected);
    });

    it('should be case-insensitive', () => {
        expect(parseDatabaseType('PostgreSQL')).toBe(DatabaseType.POSTGRESQL);
        expect(parseDatabaseType('MYSQL')).toBe(DatabaseType.MYSQL);
        expect(parseDatabaseType('SQLite')).toBe(DatabaseType.SQLITE);
    });
});
