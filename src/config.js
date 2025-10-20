import dotenv from 'dotenv'
import Groq from "groq-sdk";

dotenv.config();

export const PORT = 3000;

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });