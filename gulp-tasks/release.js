import { getConfig } from '../gulp.config';

const shell = require('shelljs');
const runSequence = require('run-sequence');
const readlineSync = require('readline-sync');
const exec = require('child_process').exec;

/*
* GIT FLOW - Release Branches
*
* Creating this branch starts the next release cycle, so no new features can be
* added after this point-only bug fixes, documentation generation, and other
* release-oriented tasks should go in this branch.
*
* Tag: increment major or minor number
*
*/
module.exports = function() {
  return function(callback) {
    let config = getConfig();

    const updateTypeList = [
      'automatic bump',
      'major',
      'minor',
      'patch',
      'prerelease',
      'custom version',
    ];
    let updateType = '';
    let specificVersion = '';
    let index;

    let gulpReleaseTask = 'gulp ';

    if (
      readlineSync.keyInYNStrict('Do you want to update the release version?')
    ) {
      shell.echo('CURRENT VERSION: ' + config.version);

      index = readlineSync.keyInSelect(updateTypeList, 'Which type of bump?');

      if (index === -1) {
        // CANCEL was pressed
        return;
      } else if (index > 0 && index < updateTypeList.length - 1) {
        updateType = updateTypeList[index];
      } else if (index === updateTypeList.length - 1) {
        // Specific version
        updateType = 'version';
        specificVersion = readlineSync.question(
          'Specify the version, please: ',
          {
            limit: /^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-((?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*))(?:\.(?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*)))*))?(?:\+((?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*))(?:\.(?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*)))*))?$/gm,
            limitMessage:
              'Sorry, $<lastInput> is not a valid Semantic Version.',
          },
        );
      }

      runSequence('_checkout-release', 'production', () => {
        gulpReleaseTask += `update-version --type=${updateType} ${specificVersion}`;

        let child = exec(gulpReleaseTask);

        child.stdout.on('data', data => shell.echo(data));
      });
    } else {
      // Do not update the version, switch to the release branch immediately
      runSequence('_checkout-release', 'production', callback);
    }
  };
};
