const config = {
/* don't expose password or any sensitive info, done only for demo */
// if environment variables are not defined, use default values
USER: process.env.DB_USER || 'dbTeresa',
PASSWORD: process.env.DB_PASSWORD || 'db123456789',
DB: process.env.DB_NAME || 'ecopointer'
};
config.URL =
`mongodb+srv://${config.USER}:${config.PASSWORD}@cluster0.mun28.mongodb.net/?
retryWrites=true&w=majority`;
module.exports = config;
