"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const config_1 = tslib_1.__importDefault(require("./utils/config"));
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
const express_actuator_1 = tslib_1.__importDefault(require("express-actuator"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const app = express_1.default();
app.use(express_actuator_1.default());
dotenv_1.default.config();
app.listen(config_1.default.PORT, () => {
    logger_1.default.info(`Server listening on port ${config_1.default.PORT}`);
});
