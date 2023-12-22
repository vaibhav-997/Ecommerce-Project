import mongoose from 'mongoose';


const connectToDB = async ( ) => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
        console.log(`Connection established: ${connection.connection.host}`)
    } catch (error) {
        console.log("Error connecting to DB: " + error)
    }
}

export { connectToDB }