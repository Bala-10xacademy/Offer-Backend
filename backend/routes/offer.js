const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const SECRET_CODE="balubujjivarshaseion";
const salt=10;
const {offer}=require("../schemas/offer-schema");


const getUserByToken=(token)=>{
    return new Promise((resolve,reject)=>{
        if(token){
            let userData
            try{
                userData=jwt.verify(token,SECRET_CODE);
                resolve(userData);

            }catch(err){
                reject("Invalid Token")
            }
        }else{
            reject("Token not found")
        }
    });
};
router.get("/list",async(req,res)=>{
    let validOffers=[];
    offer.find().then((offers)=>{
    //console.log(offers,"offer list")
    offers.filter((offer)=>{
        const rules=offer.target.split("and")
       // console.log(rules)
        rules.forEach((rule)=>{
            let ruleKey={}
            if(rule.includes(">")){
                ruleKey={key:rule.trim().split(">")[0],value:parseInt(rule.trim().split(">"))[1],operator:">"}
                console.log(req.body[ruleKey.key])
                if(req.body[ruleKey.key]>ruleKey.value){
                    validOffers.push(offer)
                }
                console.log(validOffers)
            }else{
                ruleKey={key:rule.trim().split("<")[0],value:rule.trim().split("<")[1],operator:"<"}
                //console.log(req.body,ruleKey.key,req.body(ruleKey.key),ruleKey.value)
                if(req.body[ruleKey.key]<ruleKey.value){
                    validOffers.push(offer)
                }
                //console.log(validOffers)
            }
            const condition=`${req.body[ruleKey.key]} ${ruleKey.operator} ${ruleKey.value}`;
            if(req.body[ruleKey.key] <ruleKey.operator> ruleKey.value){
                validOffers.push(offer)
            }
        });
    });
    res.Status(200).send(validOffers);
    }).catch(()=>{
        res.status(500).send("Internal Server Error")
    });


});
router.post("/create",async(req,res)=>{
    const offerData={...req.body}
    getUserByToken(req.headers.authorization).then((user)=>{
        offer.create({...req.body,username:user.username}).then((offer)=>{
            res.status(200).send(offer.title +" " +"created successfuly");
        }).catch((err)=>{
            res.status(400).send({message:err.message})
        });
    }).catch((err)=>{
        res.status(400).send(err)
    })

})
router.put("/update",async(req,res)=>{
    offer.updateOne({_id:req.body.id},req.body.newData);
});
router.delete("/delete",async(req,res)=>{
    offer.deleteOne({_id:req.body.id});
})
module.exports=router;