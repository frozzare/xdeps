import fs from 'fs';
import glob from 'glob';
import readdirp from 'readdirp';

const MODULE_REGEXS = [
  /require\((?:"|')(.+?)(?:"|')\)/,
  /from (?:"|')(.+?)(?:"|')/,
];
const FILTER_REGEX = /^[a-zA-Z0-9@].*[a-zA-Z0-9@]$/;

type Options = {
  excludeFn: (file: string) => boolean;
  pattern: string;
  text: boolean;
};

export const parseOptions = (
  folder: string,
  opts?: Partial<Options>
): Options => ({
  excludeFn: (file: string) =>
    file.indexOf('node_modules') !== -1 || file.indexOf('.min.') !== -1,
  pattern: `${folder}/src/**/*.+(js|ts|jsx|tsx|vue)`,
  text: false,
  ...(opts ? opts : {}),
});

const filterDeps = (deps: string[]) =>
  deps.filter((dep) => dep && dep.search(FILTER_REGEX) !== -1);

const findFiles = async (pattern: string) => {
  try {
    if (fs.lstatSync(pattern).isDirectory()) {
      const files = await readdirp.promise(pattern);
      return files.map((file) => file.fullPath);
    }
  } catch (err) {}

  return glob.sync(pattern);
};

const find = (text: string): string[] => {
  const deps: string[] = [];
  const lines = text.split('\n');

  for (let line of lines) {
    let match: any = false;
    while (match !== null) {
      for (const reg of MODULE_REGEXS) {
        match = reg.exec(line);

        if (!match && reg === MODULE_REGEXS[MODULE_REGEXS.length - 1]) {
          break;
        } else if (match) {
          deps.push(match[match[1] === undefined ? 2 : 1]);
          line = line.replace(match[0], '');
        }

        match = false;
      }
    }
  }

  return deps;
};

export const findDeps = async (
  folder: string,
  opts?: Partial<Options>
): Promise<string[]> => {
  const options = parseOptions(folder, opts);
  let deps: string[] = [];

  if (options.text) {
    deps = find(folder);
  } else {
    const files = await findFiles(options.pattern);
    for (const file of files) {
      if (options.excludeFn(file)) {
        continue;
      }

      const text = fs.readFileSync(file, 'utf8');
      deps = deps.concat(find(text));
    }
  }

  return Array.from(new Set(filterDeps(deps)));
};
