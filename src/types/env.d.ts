declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string; // Set to 'true' when running jest

      DATABASE_URI: string;
      REDIS_URI: string;
      REDIS_PREFIX: string;

      AUTH_SECRET: string;
      AUTH_SECURE: string;
      SIGN_UP_SECRET: string;
    }
  }
}

export {};
