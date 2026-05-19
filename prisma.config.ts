// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/technest_dev',
  },
};
