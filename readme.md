# xdeps

> work in progress

Find node dependencies from files, directory or text.

## usage

### CLI

```
Usage: xdeps [options] [glob pattern or directory]

Find node dependencies from files, directory or text.

Default glob pattern:
    ${cwd}/src/**/*.+(js|ts|jsx|tsx|vue)

Options
  -i, --install     install all dependencies (not dev dependencies)
  -d, --dev         install all dependencies as dev dependencies
  -v, --version     output the version number
  -h, --help        output usage information
```

### Module

```js
const { findDeps } = require('xdeps');

findDeps(__dirname).then((deps) => {
  console.log(deps);
});
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)
