import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local || .env` });


export const {
    PORT,
    NODE_ENV,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SENDER_EMAIL,
    FRONTEND_URL
} = process.env;