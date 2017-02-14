const gutil = require('gulp-util'),
        through = require('through2'),
        PLUGIN_NAME = 'gulp-preprocessor-classes';

module.exports = function () {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(new gutil.PluginError(PLUGIN_NAME, 'File not found'));
            return;
        }
        if (file.isStream()) {
            cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }
        var fileContent = file.contents.toString(enc), regexp = /class*=*/ig;
        while (true) {
            var result = regexp.exec(fileContent);
            if (!result) {
                break;
            }
            var i = result.index, str = '', go = false, tpl = new Object(), f = false, j = 0;
            while (true) {
                var sbl = fileContent[i];
                if (!sbl) {
                    break;
                }
                if (!go && ('"' === sbl || "'" === sbl)) {
                    go = true;
                } else if (go && '"' !== sbl && "'" !== sbl) {
                    str += sbl;
                    if (f && ']' === sbl) {
                        f = false;
                    } else if (!f && '[' === sbl) {
                        f = true;
                        j++;
                        tpl[j] = '';
                    } else if (f && '[' !== sbl && ']' !== sbl) {
                        tpl[j] += sbl;
                    }
                } else if (go && ('"' === sbl || "'" === sbl)) {
                    break;
                }
                i++;
            }
            if (-1 !== str.indexOf('[') && -1 !== str.indexOf(']')) {
                var tpAr = new Array();
                for (var z in tpl) {
                    tpAr.push(tpl[z].split(','));
                }
                var res = new Array(), length = tpAr[0].length;
                for (var r in tpAr) {
                    if (length !== tpAr[r].length) {
                        cb(new gutil.PluginError(PLUGIN_NAME, 'error: '));
                        return;
                    }
                    for (var m in tpAr[r]) {
                        if ('undefined' === typeof res[m]) {
                            res[m] = str;
                        }
                        var ss = tpAr[r][m].replace(' ', ''), rep = '[' + tpAr[r].join(',') + ']';
                        res[m] = res[m].replace(rep, ss);
                    }
                }
                res = res.join(' ');
                res = res.split(' ');
                var final = new Array();
                res.forEach(function (cls) {
                    if (-1 === final.indexOf(cls)) {
                        final.push(cls);
                    }
                });
                fileContent = fileContent.replace(str, final.join(' '));
            }
        }
        file.contents = new Buffer(fileContent);
        this.push(file);
        cb();
    });
};
