import dotenv from 'dotenv'
import Groq from "groq-sdk";

dotenv.config();

//  Puerto del servidor
export const PORT = 3000;

// configuración de SDK Groq
export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });