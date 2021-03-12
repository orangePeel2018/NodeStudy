const log4js = require('log4js');
log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: '../../aixhlog/log.log',
            layout: {
                type: 'pattern',
                pattern: '%r %p - %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug'
        }
    }
})
exports.logger = log4js.getLogger();