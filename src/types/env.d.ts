declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      TEST_ENV: string; // Set to be 'true' when running jest tests

      DATABASE_URI: string;
      TEST_DATABASE_URI: string;

      REDIS_PREFIX: string;

      AUTH_SECRET: string;
      AUTH_SECURE: string;
      SIGN_UP_SECRET: string;
    }
  }
}

export {};
