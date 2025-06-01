import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/api/v1/website",async(req ,res)=> {
   try{
      const userId=req.userId!;
      const {url}=req.body;

      const website=await prismaClient.website.create({
         data:{
            userId,
            url
         }
      })
      res.json(website);
   }catch(err){
      res.status(500).json({error:"Something went wrong in post-website"})
   }

})

app.get("/api/v1/website-add",(req ,res)=> {
   const userId=req.userId;
   const {url}=req.query;
   res.json({message:"Website recived successfully"});
   console.log("User ID:", userId , "URL:", url);
})

app.get("api/v1/website/status",(req ,res)=> {

})

app.delete("/api/v1/website",(req,res)=> {

})

app.listen(5000,()=> {
      console.log("Server is running on port 5000");
})