const config = {
/* don't expose password or any sensitive info, done only for demo */
// if environment variables are not defined, use default values
USER: process.env.DB_USER || 'dbTeresa',
PASSWORD: process.env.DB_PASSWORD || 'db123456789',
DB: process.env.DB_NAME || 'ecopointer',
SECRET: process.env.SECRET
};
config.URL =
`mongodb+srv://dbTeresa:db123456789@cluster0.arrsee4.mongodb.net/ecopointer?retryWrites=true&w=majority`;
module.exports = config;

 
