import { findDeps } from './src';

describe('test', () => {
  it('should find deps in src folder', async () => {
    const deps = await findDeps(__dirname);
    expect(deps.length).toBe(3);
  });

  it('should find deps in text', async () => {
    const deps = await findDeps(
      `import fs from "fs"; const fs = require('fs');`,
      {
        text: true,
      }
    );
    expect(deps).toEqual(['fs']);
  });

  it('should find deps in text', async () => {
    const deps = await findDeps(
      `import foo from "foo-bar-something-124-w"; const fs = require('fs');`,
      {
        text: true,
      }
    );
    expect(deps).toEqual(['foo-bar-something-124-w', 'fs']);
  });

  it('should find deps in text even if mixed', async () => {
    const deps = await findDeps(
      `import foo from "foo-bar-something-124-w"; const fs = require('fs'); const path = require("path"); import dotenv from 'dotenv'`,
      {
        text: true,
      }
    );
    expect(deps).toEqual(['dotenv', 'foo-bar-something-124-w', 'fs', 'path']);
  });
});
