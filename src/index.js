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
    const context = await getContext(req, res, pageDataPath, globalDataPath);
    const { template, filename, basedir } = res;
    if (template) {
      try {
        res.end(ejs.render(template, context));
      } catch (e) {
        console.log(e);
        next();
      }
    } else if (existsSync(templatePath)) {
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
