import mongoose, { Schema } from "mongoose";

const UsuarioSchema = new Schema({
    nome: { type: String, require: true },
    email: { type: String, require: true },
    senha: { type: String, require: true },
    avatar: { type: String, require: false },
    seguidores: { type: Number, default: 0 },
    seguindo: { type: Number, default: 0 },
    publicaçoes: { type: Number, default: 0 },
});

export const UsuarioModel = (mongoose.model('UsuarioModel') ||
    mongoose.model('Usuario', UsuarioSchema));