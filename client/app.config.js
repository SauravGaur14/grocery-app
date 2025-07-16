import 'dotenv/config'; // loads .env

export default ({ config }) => ({
  ...config,
  extra: {
    API_BASE_URL: process.env.API_BASE_URL,
    LOCATIONIQ_KEY: process.env.LOCATIONIQ_KEY,
  },
});
