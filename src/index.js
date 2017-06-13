import { existsSync, readFileSync } from 'fs';
import assign from 'object-assign-deep';
import ejs from 'ejs';
import { getPath, getContext } from 'packing-template-util';

module.exports = function(options) {
  options = assign({
    encoding: 'utf-8',
    extension: '.ejs',
    templates: '.',
    mockData: '.',
    globalData: '__global.js',
    rewriteRules: {}
  }, options);

  return async (req, res, next) => {
    const { templatePath, pageDataPath, globalDataPath } = getPath(req, options);
    if (existsSync(templatePath)) {
      const context = await getContext(req, res, pageDataPath, globalDataPath);
      try {
        const tpl = readFileSync(templatePath, { encoding: options.encoding });
        const output = ejs.render(tpl, context);
        res.end(output);
      } catch (e) {
        console.log(e);
        next();
      }
    } else {
      next();
    }
  };
};
