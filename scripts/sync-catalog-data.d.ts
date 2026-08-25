export class SyncError extends Error {}

export const PUBLIC_FILENAMES: string[];

export function syncCatalogData(
  sourceDir: string,
  destDir: string,
): {
  source: string;
  dest: string;
  files: string[];
};
