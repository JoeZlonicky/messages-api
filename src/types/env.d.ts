declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URI: string;
      AUTH_SECRET: string;
      AUTH_SECURE: string;
      SIGN_UP_SECRET: string;
    }
  }
}

export {};
