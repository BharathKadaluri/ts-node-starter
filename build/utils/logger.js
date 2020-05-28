"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, prettyPrint } = winston_1.format;
const LOG = winston_1.createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: './error.log', level: 'error' }),
        new winston_1.transports.File({ filename: './info.log', level: 'info' })
    ],
    exitOnError: false
});
exports.default = LOG;
