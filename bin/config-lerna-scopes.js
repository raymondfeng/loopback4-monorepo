//=============================================================================
// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2020
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//=============================================================================

/**
 * This is an internal script to list lerna packages.
 * See https://github.com/marionebl/commitlint/pull/406
 */
'use strict';

const {getPackages} = require('@lerna/project');

module.exports = {
  rules: {
    // https://github.com/marionebl/commitlint/blob/master/docs/reference-rules.md
    'scope-enum': async ctx => [2, 'always', await getPackageNames(ctx)],
  },
};

async function getPackageNames(context) {
  const ctx = context || {};
  const cwd = ctx.cwd || process.cwd();
  // List all lerna packages
  const packages = await getPackages(cwd);

  // Get a list of names. Npm scopes will be removed, for example,
  // @loopback/core -> core
  return packages.map(getShortName);
}

/**
 * Get short name of a package. The NPM scope will be removed if it exists.
 * For example, the short name of `@loopback/core` is `core`.
 * @param {Package} pkg - Lerna project
 */
function getShortName(pkg) {
  const name = pkg.name;
  return name.startsWith('@') ? name.split('/')[1] : name;
}

if (require.main === module) {
  getPackageNames().then(
    names => console.log('Scopes: %s', names),
    err => {
      console.error(err);
      process.exit(1);
    },
  );
}
