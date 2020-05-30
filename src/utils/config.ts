const config  = {
    PORT: process.env.PORT || 3000,
    NSDC_DOMAIN: process.env.NSDC_DOMIN,
    NSDC_UPDATE_USER :`${process.env.NSDC_DOMIN}/API/user_update`,
    CHECK_API_TOKEN_URL:`${process.env.NSDC_DOMIN}/API/check_data_origin`,
    NSDC_IV: process.env.IV,
    NSDC_SECRET: process.env.SECRET,
    NSDC_API_KEY: process.env.API_KEY,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_USERNAME: process.env.MYSQL_USERNAME,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_PORT: process.env.MYSQL_PORT,
    LEARNWISE_API_EXPIRY: process.env.LEARNWISE_API_EXPIRY,
    LEARNWISE_API_APP_KEY: process.env.LEARNWISE_API_APP_KEY,
    LEARNWISE_API_APP_SECRET: process.env.LEARNWISE_API_APP_SECRET,
    PROD_LEARNWISE_DOMAIN: process.env.PROD_LEARNWISE_DOMAIN,
    ENABLE_CRON_JOBS: process.env.ENABLE_CRON_JOBS
}

export default config;