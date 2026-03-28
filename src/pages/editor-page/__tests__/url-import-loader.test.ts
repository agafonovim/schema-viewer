import { describe, it, expect } from 'vitest';
import {
    resolveAndValidateUrl,
    resolveImportMethod,
    validFormats,
} from '../use-url-import-loader';

describe('resolveAndValidateUrl', () => {
    it('should resolve an absolute HTTPS URL', () => {
        const result = resolveAndValidateUrl(
            'https://example.com/schema.dbml',
            'https://localhost/'
        );
        expect(result).toBe('https://example.com/schema.dbml');
    });

    it('should resolve an absolute HTTP URL', () => {
        const result = resolveAndValidateUrl(
            'http://example.com/schema.dbml',
            'https://localhost/'
        );
        expect(result).toBe('http://example.com/schema.dbml');
    });

    it('should resolve a relative URL against the base', () => {
        const result = resolveAndValidateUrl(
            'schemas/my-schema.json',
            'https://user.github.io/repo/'
        );
        expect(result).toBe(
            'https://user.github.io/repo/schemas/my-schema.json'
        );
    });

    it('should reject file: protocol', () => {
        expect(() =>
            resolveAndValidateUrl('file:///etc/passwd', 'https://localhost/')
        ).toThrow('Unsupported protocol: file:');
    });

    it('should reject javascript: protocol', () => {
        expect(() =>
            resolveAndValidateUrl('javascript:alert(1)', 'https://localhost/')
        ).toThrow('Unsupported protocol: javascript:');
    });

    it('should reject data: protocol', () => {
        expect(() =>
            resolveAndValidateUrl('data:text/plain,hello', 'https://localhost/')
        ).toThrow('Unsupported protocol: data:');
    });

    it('should preserve query parameters in the URL', () => {
        const result = resolveAndValidateUrl(
            'https://example.com/schema.json?token=abc',
            'https://localhost/'
        );
        expect(result).toBe('https://example.com/schema.json?token=abc');
    });
});

describe('resolveImportMethod', () => {
    it('should use explicit format when provided', () => {
        expect(resolveImportMethod('dbml', '{}')).toBe('dbml');
        expect(resolveImportMethod('ddl', '{}')).toBe('ddl');
        expect(resolveImportMethod('query', 'Table x {}')).toBe('query');
    });

    it('should ignore invalid format and auto-detect', () => {
        const dbml = 'Table users {\n  id int [pk]\n}';
        expect(resolveImportMethod('xml', dbml)).toBe('dbml');
    });

    it('should auto-detect DBML when no format specified', () => {
        const dbml = 'Table users {\n  id int [pk]\n}';
        expect(resolveImportMethod(null, dbml)).toBe('dbml');
    });

    it('should auto-detect DDL when no format specified', () => {
        const ddl = 'CREATE TABLE users (id INT PRIMARY KEY);';
        expect(resolveImportMethod(null, ddl)).toBe('ddl');
    });

    it('should auto-detect JSON when no format specified', () => {
        const json = '{"tables": []}';
        expect(resolveImportMethod(null, json)).toBe('query');
    });

    it('should throw when format is not specified and cannot be detected', () => {
        expect(() => resolveImportMethod(null, 'random text')).toThrow(
            'Could not detect import format'
        );
    });
});

describe('validFormats', () => {
    it('should contain exactly dbml, ddl, query', () => {
        expect(validFormats.size).toBe(3);
        expect(validFormats.has('dbml')).toBe(true);
        expect(validFormats.has('ddl')).toBe(true);
        expect(validFormats.has('query')).toBe(true);
    });

    it('should not contain invalid formats', () => {
        expect(validFormats.has('xml')).toBe(false);
        expect(validFormats.has('csv')).toBe(false);
        expect(validFormats.has('')).toBe(false);
    });
});
