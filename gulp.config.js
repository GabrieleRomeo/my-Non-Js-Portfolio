const fs = require('fs');
const path = require('path');

import { oneLine } from 'common-tags';

export const RELEASEBRANCH = 'release-branch';
export const VERSIONING = '?v=@version@';

// Initializes file paths
export const PATHS = {};

PATHS.ROOT = '.';
PATHS.SRC_DIR = path.join(PATHS.ROOT, 'src');
PATHS.DIST_DIR = path.join(PATHS.ROOT, 'public');
PATHS.TMP = path.join(PATHS.SRC_DIR, 'tmp');
PATHS.CSS_SRC = path.join(PATHS.SRC_DIR, 'stylesheets');
PATHS.CSS_CMPS = path.join(PATHS.SRC_DIR, 'components');
PATHS.CSS_DST = path.join(PATHS.DIST_DIR, 'css');
PATHS.JS_SRC = path.join(PATHS.SRC_DIR, 'js');
PATHS.JS_DST = path.join(PATHS.DIST_DIR, 'js');
PATHS.IMAGES_SRC = path.join(PATHS.SRC_DIR, 'img');
PATHS.IMAGES_DST = path.join(PATHS.DIST_DIR, 'img');

// Gulp HELPS
export const HELPS = {};

HELPS.deploy = oneLine`Deploys the sowftare on Github and publishes the
                      ./${PATHS.DIST_DIR} dir as
                      a live page onto the gh-pages branch.`;

HELPS.release = oneLine`Updates the release version and switches to the release
                        branch`;

HELPS.production = oneLine`Cleans the dist, builds the software, moves all of
                           the assets under the ./${PATHS.DIST_DIR} dir
                           and starts the server for a live preview`;

HELPS.updateVersion = oneLine`Bumps the package.json to the next minor revision.
                      (for example from 0.1.1 to 0.1.2)`;

/**
 * Utility function that returns the package.json config file
 */
export const getConfig = () => {
  const json = JSON.parse(fs.readFileSync('./package.json'));
  return json;
};
