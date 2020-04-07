import mongoose, { Schema, Document } from "mongoose"

export interface ICat extends Document {
  name: string
}
const CatSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model<ICat>("Cat", CatSchema)
