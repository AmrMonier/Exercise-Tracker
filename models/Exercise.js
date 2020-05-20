const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true }
})

const Exercise = mongoose.model('Exercise', ExerciseSchema)

module.exports = Exercise