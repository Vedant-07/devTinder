const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailID:{
        type:String,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:[18,'Must be atleast 18 ,got ${VALUE}']
    },
    gender:{
        type:String,
        enum:{
            values:["male","female",'others'],
            message:'{VALUE} , Please select the others category'
        }
    },
    bio:{
        type:String,
        default:"some text for the bio by default, edit later"
    },
    skills:{
        type:[String],
        validate:{
            validator(skills)
            {
                return skills.length>0
            },
            message:props => `${props.value} PLeasr addd atleast 1 skill`
        },
            //this was the cosing style ,and its not mentioned in the docs???
            required:true
        }
     
})

module.exports=mongoose.model("User",userSchema);



