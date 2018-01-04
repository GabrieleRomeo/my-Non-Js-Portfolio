const fs = require('fs');

export const RELEASEBRANCH = 'release-branch';
export const VERSIONING = '?v=@version@';

/**
 * Utility function that returns the package.json config file
 */
export const getConfig = () => {
  const json = JSON.parse(fs.readFileSync('./package.json'));
  return json;
};
