const { Sequelize } = require("sequelize");

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_SSL = process.env.DB_SSL === 'true';

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
    console.error('Database configuration is missing. Please check your environment variables.');
    process.exit(1);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
        ssl: DB_SSL ? {
            require: true,
            rejectUnauthorized: false,
        } : false,
    },
    pool: {
        max: 5,               // Maximum number of connection in pool
        min: 0,               // Minimum number of connection in pool
        acquire: 30000,       // Maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000,          // Maximum time, in milliseconds, that a connection can be idle before being released
    },
    define: {
        timestamps: true,     // Add createdAt and updatedAt timestamps
        underscored: true,    // Use snake_case rather than camelCase column names
    }
});

module.exports = sequelize;