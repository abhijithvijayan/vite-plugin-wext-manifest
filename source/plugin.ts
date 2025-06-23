/**
 *  vite-plugin-wext-manifest
 *
 *  @author   abhijithvijayan <abhijithvijayan.in>
 *  @license  MIT License
 */

import type {Plugin, ResolvedConfig} from 'vite';
import path from 'node:path';
import {findUp} from 'find-up-simple';
import {readPackage} from 'read-pkg';
import {loadJsonFile} from 'load-json-file';

import transformer, {
  BrowserType,
  browserVendors,
} from 'wext-manifest-transformer';
import {PLUGIN_NAME} from './constants';

interface WextManifestOptions {
  /**
   *  The path to the source manifest.json file, relative to the project root.
   */
  manifestPath: string;
  /**
   *  If true, updates manifest.json version field with package.json version. It is often useful for easy release of web-extension.
   */
  usePackageJSONVersion?: boolean;
}

export default function plugin(options: WextManifestOptions): Plugin {
  let config: ResolvedConfig;

  if (!options?.manifestPath) {
    throw new Error(`${PLUGIN_NAME}: \`manifestPath\` option is required.`);
  }

  return {
    name: PLUGIN_NAME,
    configResolved(resolvedConfig): void {
      config = resolvedConfig;
    },
    async buildStart(): Promise<void> {
      const {mode, root} = config;
      const targetBrowser = process.env.TARGET_BROWSER;

      if (!targetBrowser) {
        this.error('`TARGET_BROWSER` environment variable is not set.');
      }

      if (!browserVendors.includes(targetBrowser as BrowserType)) {
        this.error(`Browser "${targetBrowser}" is not supported.`);
      }

      try {
        const sourceManifestPath = path.resolve(root, options.manifestPath);
        this.addWatchFile(sourceManifestPath);
        // Read and parse manifest.json file
        const manifestInput = await loadJsonFile(sourceManifestPath);
        // 1. Transform the manifest
        const transformed = transformer(
          manifestInput,
          targetBrowser as BrowserType,
          mode
        );

        // 2. Inject version from package.json if option is enabled
        const usePackageJSONVersion = !!options.usePackageJSONVersion;
        if (usePackageJSONVersion) {
          try {
            // find the closest package.json file
            const packageJsonPath = await findUp('package.json');
            if (!packageJsonPath) {
              throw new Error("Couldn't find a closest package.json");
            }

            this.addWatchFile(packageJsonPath);
            const packageJson = await readPackage({
              ...options,
              cwd: path.dirname(packageJsonPath),
            });
            if (transformed.version) {
              transformed.version = packageJson.version.replace('-beta.', '.'); // eg: replaces `2.0.0-beta.1` to `2.0.0.1`
            }
          } catch (err) {
            this.error(
              `Failed to process package.json: ${(err as Error).message}`
            );
          }
        }

        // 3. Emit the final manifest file
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: JSON.stringify(transformed, null, 2),
        });
      } catch (err) {
        this.error(
          `Failed to process manifest.json: ${(err as Error).message}`
        );
      }
    },
  };
}
