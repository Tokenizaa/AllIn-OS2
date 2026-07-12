import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const tsConfigPaths = resolve(process.cwd(), "tsconfig.e2e.json");

const aliases: Record<string, string> = {
  "@/*": "./src/*",
  "@shared/*": "./shared/*",
};

for (const [alias, target] of Object.entries(aliases)) {
  const resolved = resolve(process.cwd(), target.replace("*", ""));
  const aliasPath = alias.replace("/*", "");
  Object.defineProperty(require.extensions, aliasPath, { value: undefined, writable: true });
  (require.extensions as Record<string, unknown>)[aliasPath] = undefined;
  try {
    Object.defineProperty(module, "paths", {
      value: {
        ...(module as any).paths,
        [alias]: resolved,
        [alias + "/*"]: resolved,
      },
      writable: true,
    });
  } catch {
    // ignore if not writable
  }
}

process.env.__E2E_ALIASES_SET = "1";
