// knexfile.js
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3', // or 'database.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds'
    },
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations',
    }
  },
  production: { // Optional Production configuration.
    client: 'sqlite3',
    connection: {
      filename: './prod.sqlite3', // different database file in production
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations',
    },
  },
};
