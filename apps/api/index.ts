import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";

const app = express();
app.use(express.json());

app.post("/api/v1/website",authMiddleware,async(req ,res)=> {
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

app.get("/api/v1/websites/status",authMiddleware,async(req ,res)=> {
   try{
      const website =req.params.websiteId
      const userId=req.userId!;
   
      const data=await prismaClient.website.findFirst({
         where:{
            id:website,
            userId,
            dissabled:false
         },
         include:{
            websiteTick: true
         }
      })
   
      res.json(data)
   }catch(err){
      res.status(500).json({error:"Something went wrong in get-website"})
   }
})

app.get("api/v1/website",authMiddleware,async(req ,res)=> {
   const userId=req.userId
   const data =await prismaClient.website.findMany({
      where:{
         userId,
         dissabled:false
      }
   })
})

app.delete("/api/v1/website",authMiddleware,async(req,res)=> {
   const website=req.params.websiteId
   await prismaClient.website.update({
      where:{
         id:website
      },
      data:{
         dissabled:true
      }
   })
})

app.listen(3000,()=> {
      console.log("Server is running on port 3000");
})