const Book=require("../models/Book");

const getallbooks=async(req,res,next)=>{
    let books;
    try{
        books=await Book.find();
    }catch(err){
        console.log(err);
    }
    if(!books){
        return res.status(404).json({message:"No products found"});

    }
    return res.status(200).json({books});
}
const getbyid=async(req,res,next)=>{
    const id=req.params.id;
    let book;
    try{
        book=await Book.findById(id);
    }
    catch(err){
        console.log(err);
    }
    if(!book){
        return res.status(404).json({message:"No book found"});

    }
    return res.status(200).json({book});
}
const addbook=async(req,res)=>{
    console.log(req.body);
    const {name,author,description,image,pdfname}=req.body;

    let book;
    try{
        book=new Book({
            name,
            author,
            description,
            image,
            pdfname,

        });
        await book.save();
    }
    catch(err){
       console.log(err);
    }
    if(!book){
        return res.status(500).json({message:"unamble to add"});
    }
    return res.status(201).json(book);
}
const updatebook=async(req,res,next)=>{
    const id=req.params.id;
    const {name,author,description,image,pdfname}=req.body;
    let book;
    try{
        book =await Book.findByIdAndUpdate(id,{
            name,
            author,
            description,
            image,
            pdfname,
        })
        book=await book.save();
    }catch(err){
        console.log(err);
    }
    if(!book){
        return res.status(500).json({message:"unable to update"});
    }
    return res.status(200).json(book);

}
const deletebook=async(req,res,next)=>{
    const id=req.params.id;
    let book;
    try{
        book=await Book.findByIdAndRemove(id);
    }catch(err){
        console.log(err);
    }
    if(!book){
        return res.status(500).json({message:"unable to delete"});
    }
    return res.status(200).json({message:"deleted"});
}


exports.getallbooks=getallbooks;
exports.addbook=addbook;
exports.getbyid=getbyid;
exports.updatebook=updatebook;
exports.deletebook=deletebook;