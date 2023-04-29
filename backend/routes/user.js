const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const SECRET_CODE="balubujjivarshaseion";
const salt=10;
const {user}=require("../schemas/user-schema");

router.post("/signup", async(req,res)=>{ //to create user
    bcrypt.genSalt(salt,(saltErr,saltValue)=>{
        if(saltErr){
            res.status(401).send("unble to Access");
        }else{
            bcrypt.hash(req.body.password,saltValue,(hashErr,hashValue)=>{
                if(hashErr){
                    req.status(401).send("unable to process");
                }
                else {
                    user.create({username:req.body.username,password:hashValue,email:req.body.email|"",mobilenum:req.body.mobilenum|""}).then((user)=>{
                        res.status(200).send(user.username + " "+"created successfully");
                    }).catch((err)=>{
                        res.status(400).send(err.message);
                    })
                            
                }
            })
        }

    })
})


router.post("/signin",async(req,res)=>{ //to read user
    user.findOne({username:req.body.username}).then(()=>{
        if(!user){
            res.status(401).send("User not Exist")
        }else{
            if(!bcrypt.compareSync(req.body.password,user.password)){
                res.status(401).send("Invalid Password")
            }else{
                const token=jwt.sign({id:user._id,username:user.username},SECRET_CODE);
                res.status(200).send({message:"User loggedin successfully",token:token});
            }
        }

    }).catch(()=>{

    })
})
module.exports=router;