import mongoose from "mongoose"

const tourSchema = mongoose.Schema({
    img: String,
    name: String,
    country: String,
    price: String,
    duration: String,
    shortDescription: String,
    title: String,
    durationAndLimit:String,
    sections: {
        type: Array,
        default:[]
    }
})

const Tours = mongoose.model("Tours", tourSchema);

export default Tours;