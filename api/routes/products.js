const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');
const storage = multer.diskStorage({
destination : function(req,file,cb) {
    cb(null,'./uploads/');
},
filename: function(req,file,cb) {
    console.log(new Date().toString() + file.originalname);
    cb(null, file.originalname)
}
});

const fileFilter = (req,file,cb) => {
//reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetypec === 'image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}

const upload = multer({
    storage : storage,
    limits : {fileSize : 1024*1024*5},
    fileFilter : fileFilter
});


router.get('/', ProductsController.get_all_products);

// router.post('/', (req,res,next) => {
//     const product = new Product({
//         _id : new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         price: req.body.price
//     });
//     product.save().then(result => {

//         res.status(201).json({
//             message: 'Created product successfully',
//             createdProduct: {
//                 name : result.name,
//                 price : result.price,
//                 id: result._id,
//                 request : {
//                     type: 'GET',
//                     url : 'http://localhos:3001/'+result._id
//                 }
//             }
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error:err
//         });
//     });
    
   
// });

router.post('/',checkAuth, upload.single('productImage'),ProductsController.create_product);


router.get('/:productId',ProductsController.get_product);

router.patch('/:productId',checkAuth,ProductsController.update_product);

router.delete('/:productId',checkAuth,ProductsController.delete_product);

module.exports = router;