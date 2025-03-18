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

app.get("/api/v1/websites",authMiddleware,(req ,res)=> {

})

app.get("api/v1/website/status",authMiddleware,(req ,res)=> {

})

app.delete("/api/v1/website",authMiddleware,(req,res)=> {

})

app.listen(3000,()=> {
      console.log("Server is running on port 3000");
})