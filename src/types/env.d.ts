declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URI: string;
      AUTH_SECRET: string;
      SERVER_SECRET: string;
    }
  }
}

export {};
