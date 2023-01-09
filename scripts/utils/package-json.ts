import { readJSON, writeJSON } from 'fs-extra';
import { join } from 'path';

export async function updatePackageScripts({ cwd, prefix }: { cwd: string; prefix: string }) {
  const packageJsonPath = join(cwd, 'package.json');
  const packageJson = await readJSON(packageJsonPath);
  packageJson.scripts = {
    ...packageJson.scripts,
    ...(packageJson.scripts.storybook && {
      storybook: `${prefix} ${packageJson.scripts.storybook}`,
      'build-storybook': `${prefix} ${packageJson.scripts['build-storybook']}`,
    }),
    // See comment in combine-compodoc as to why this is necessary
    ...(packageJson.scripts['docs:json'] && {
      'docs:json': 'DIR=$PWD; cd ../../scripts; yarn ts-node combine-compodoc $DIR',
    }),
  };
  await writeJSON(packageJsonPath, packageJson, { spaces: 2 });
}
