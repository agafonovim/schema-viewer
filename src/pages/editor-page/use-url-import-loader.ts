import { useChartDB } from '@/hooks/use-chartdb';
import { useFullScreenLoader } from '@/hooks/use-full-screen-spinner';
import { useToast } from '@/components/toast/use-toast';
import { importDBMLToDiagram } from '@/lib/dbml/dbml-import/dbml-import';
import { sqlImportToDiagram } from '@/lib/data/sql-import';
import { loadFromDatabaseMetadata } from '@/lib/data/import-metadata/import';
import { detectImportMethod } from '@/lib/import-method/detect-import-method';
import { parseDatabaseType } from '@/lib/domain/database-type';
import type { ImportMethod } from '@/lib/import-method/import-method';
import type { Diagram } from '@/lib/domain/diagram';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export async function importByMethod(
    method: ImportMethod,
    text: string,
    databaseType: ReturnType<typeof parseDatabaseType>
): Promise<Diagram> {
    switch (method) {
        case 'dbml':
            return importDBMLToDiagram(text, { databaseType });
        case 'ddl':
            return sqlImportToDiagram({
                sqlContent: text,
                sourceDatabaseType: databaseType,
                targetDatabaseType: databaseType,
            });
        case 'query':
            return loadFromDatabaseMetadata({
                databaseType,
                databaseMetadata: JSON.parse(text),
            });
    }
}

export const validFormats = new Set<string>(['dbml', 'ddl', 'query']);

export function resolveAndValidateUrl(src: string, base: string): string {
    const resolved = new URL(src, base);
    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
        throw new Error(`Unsupported protocol: ${resolved.protocol}`);
    }
    return resolved.href;
}

export function resolveImportMethod(
    formatParam: string | null,
    text: string
): ImportMethod {
    if (formatParam && validFormats.has(formatParam)) {
        return formatParam as ImportMethod;
    }
    const detected = detectImportMethod(text);
    if (!detected) {
        throw new Error(
            'Could not detect import format. Use ?format=dbml|ddl|query'
        );
    }
    return detected;
}

export const useUrlImportLoader = () => {
    const [searchParams] = useSearchParams();
    const srcParam = searchParams.get('src');
    const formatParam = searchParams.get('format');
    const dbParam = searchParams.get('db');
    const isUrlImportLoad = srcParam !== null;

    const { loadDiagramFromData } = useChartDB();
    const { showLoader, hideLoader } = useFullScreenLoader();
    const { toast } = useToast();
    const loadedRef = useRef(false);

    useEffect(() => {
        if (!srcParam || loadedRef.current) return;
        loadedRef.current = true;

        const load = async () => {
            showLoader();
            try {
                const url = resolveAndValidateUrl(
                    srcParam,
                    window.location.href
                );

                const response = await fetch(url, {
                    credentials: 'omit',
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch: ${response.status} ${response.statusText}`
                    );
                }

                const text = await response.text();
                const databaseType = parseDatabaseType(dbParam);
                const method = resolveImportMethod(formatParam, text);
                const diagram = await importByMethod(
                    method,
                    text,
                    databaseType
                );
                loadDiagramFromData(diagram);
            } catch (error) {
                toast({
                    title: 'Failed to load diagram from URL',
                    description:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    variant: 'destructive',
                });
            } finally {
                hideLoader();
            }
        };

        load();
    }, [
        srcParam,
        formatParam,
        dbParam,
        loadDiagramFromData,
        showLoader,
        hideLoader,
        toast,
    ]);

    return { isUrlImportLoad };
};
