const mongoose=require("mongoose")


const connectDb=async()=>{
    await  mongoose.connect("mongodb+srv://vedantnpatel7:1S6MTM4pqBEQCnFT@namastenode.yjpw9.mongodb.net/devTinder")
} 
//connecting to the cluster

 

module.exports=connectDb