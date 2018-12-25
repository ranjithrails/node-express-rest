const mongoose = require('mongoose');
const Product = require('../models/products');

exports.get_all_products = (req,res,next) => {
    Product.find().select('name price _id productImage').exec().then(docs =>{
        const response = {
            count : docs.length,
            products : docs.map(doc => {
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    productImage :doc.productImage,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3001/'+ doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
   
}

exports.create_product = (req,res,next) => {
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {

        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name : result.name,
                price : result.price,
                id: result._id,
                request : {
                    type: 'GET',
                    url : 'http://localhos:3001/'+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.get_product = (req,res,next) => { 
    const id = req.params.productId;
    Product.findById(id).select('name price id productImage').exec().then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3001/products'
                }
            });
        }
        else{
            res.status(404).json({
                message: 'No valid entry'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });

}

exports.update_product = (req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id : id},{ $set : updateOps}).exec().then(result => {
        res.status(200).json({
            message : "Product Updated",
            request : {
                type : 'GET',
                url : 'http://localhost:3001/products/'+id
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
 
}


exports.delete_product = (req,res,next) => {
    const id = req.params.productId;
    Product.deleteOne({_id : id}).exec().then(result => {
        res.status(200).json({
            message : 'Product deleted',
            request : {
                type : 'POST',
                url: 'http://localhost:3000/products',
                data: {name: 'String',price: 'Number'}
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        });
    })
   
}