import { defineConfig } from '@prisma/config';

const config = defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/technest_dev',
  },
});

export default config;
