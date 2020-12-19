const createError = require('http-errors');
const subject = require('../models/subjects');

module.exports = {
    getSubs: (req,res)=>{
        res.send(res.paginatedResults);
    },
    postSubs: async (req,res,next)=>{
        // name1 = req.body.name;
        // desc = req.body.description;
        // tags = req.body.tags;
        // var data = {
        //     name: name1,
        //     description: desc,
        //     tags: tags
        // }
    
        // subject.create(data,(err,item)=>{
        //     if(err){
        //         console.log(err);
        //         res.send({message: err})
        //     }
        //     else {
        //         res.json({id:item._id,message: "Succes"})
        //     }
        // })
    
        try{
          const {name,description,tags} = req.body;
          //tags is an array of string
          if(!name || !description || !tags){
            throw createError.Unauthorized("Please provide the necessary details!");
          }
          const subjects = new subject({name,description,tags});
          await subjects.save();
          return res.status(200).send({message:'subject added'});
        } catch(e){
           next(e)
        }
    },
    putSubs: async (req,res,next)=>{
        try{
            const name = req.params.subName;
            if(!name){
                throw createError.Unauthorized("Please provide a subject name!");
            }
            subject.findOne({name: name},(err,item)=>{
                if(err)
                    return res.status(422).send({message:"Unable to update subject"});
                else if(!item) return res.status(422).send({message:"Cant find the subject to update"});
                else if(item){
                    var obj = req.body;
                    if(obj.length == 2){
                        item.desc = obj.desc;
                        item.tags = obj.tags;
                        item.save();
                        return res.status(204).send({message:"Document updated"});
                    }
                    if(obj.length == 1){
                        if(obj.desc){
                            item.desc = obj.desc;
                            item.save();
                            return res.status(204).send({message:"Document updated"});
                        }
                        else{
                            item.tags = obj.tags;
                            item.save();
                            return res.status(204).send({message:"Document updated"});
                        }
                    }
                }
            })
        } catch(e){
            next(e)
        }
    },
    patchSubs: (req,res,next)=>{
        try{
            const name = req.params.subName;
            if(!name){
                throw createError.Unauthorized("Please provide a subject name!");
            }
            subject.findOne({name: req.params.subName},(err,item)=>{
                if(err){
                    return res.status(422).send({message:"Something went wrong, please try again"});
                }
                else if(!item) return res.status(422).send({message:"Cant find the subject to update"});
                else if(item){
                    let val = req.body.tags;
                    if(!val) throw createError.Unauthorized("Please provide a tags to append!");
                    let arr = item.tags;
                    arr.push(val);
                    item.tags = arr;
                    item.save();
                    return res.status(200).send({message:"Patched successfully"})
                }     
            })
        } catch(e){
            next(e)
        }
    },
    paginatedResults: (model) => {
        return async (req,res,next) => {
            const page = parseInt(req.query.page);
            //const limit = parseInt(req.query.limit);
            const limit = 5;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const results = {}
    
            if(req.query.tags){
                let tagnames = String(req.query.tags);
                var arr = tagnames.split(",");
    
                if(endIndex < await model.countDocuments().exec()){
                    results.next = {
                        page: page + 1,
                        limit: limit
                    }
                }
        
                if(startIndex > 0){
                    results.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
                try{
                    results.results = await model.find({tags:{$in:arr}}).limit(limit).skip(startIndex).exec()
                    res.paginatedResults = results
                    next()
                }
                catch (e) {
                    res.status(500).json({message: e.message});
                }
                
            }
            else if(req.query.subjectName){
                let sub = String(req.query.subjectName);
    
                if(endIndex < await model.countDocuments().exec()){
                    results.next = {
                        page: page + 1,
                        limit: limit
                    }
                }
        
                if(startIndex > 0){
                    results.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
    
                try{
                    results.results = await model.find({name:sub}).limit(limit).skip(startIndex).exec()
                    res.paginatedResults = results
                    next()
                }
                catch (e) {
                    res.status(500).json({message: e.message});
                }
            }
            else{
          //  const page = parseInt(req.query.page);
          //const limit = parseInt(req.query.limit);
            if(endIndex < await model.countDocuments().exec()){
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }
    
            if(startIndex > 0){
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            try{
                results.results = await model.find().limit(limit).skip(startIndex).exec()
                res.paginatedResults = results
                next()
            }
            catch (e) {
                res.status(500).json({message: e.message});
            }  
          }
        }
    } 
}