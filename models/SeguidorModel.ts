import mongoose, { Schema } from "mongoose";

const SeguidorSchema = new Schema({
    //Quem segue
    usuarioId: { type: String, require: true },
    //Quem esta seguido
    usuarioSeguidoId: { type: String, require: true },

});

export const SeguidorModel = (mongoose.models.seguidores ||
    mongoose.model('seguidores', SeguidorSchema));