const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const app=express();
const cors=require("cors");
const router=require("./routes/book-routes");
const multer = require("multer");
const {
  GridFsStorage
} = require("multer-gridfs-storage");
dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/books",router);
app.use(express.urlencoded({
  extended: false
}));
app.get("/",(req,res)=>{
  res.send("started");
})

mongoose.connect('mongodb+srv://Ahalya:ahalya123@cluster0.7mvaw.mongodb.net/bookstore?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>console.log("db connected"));


process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});
let bucket;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
  });
  // console.log(bucket);
});

const storage = new GridFsStorage({
  url: "mongodb+srv://Ahalya:ahalya123@cluster0.7mvaw.mongodb.net/bookstore?retryWrites=true&w=majority",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "newBucket"
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({
  storage
});

app.get("/book/:filename", (req, res) => {
  const file = bucket
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404)
          .json({
            err: "no files exist"
          });
      }
      bucket.openDownloadStreamByName(req.params.filename)
        .pipe(res);
    });
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200)
    .send("File uploaded successfully");
});


app.listen(process.env.PORT || 3001,()=>{
  console.log("serevr started");
})