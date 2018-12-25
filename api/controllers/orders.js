const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');

exports.orders_get_all = (req,res,next) => {
    Order.find().select("product quantity _id").populate('product','name').exec().then(docs => {
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc => {
                return {
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request :{
                        type : "GET",
                        url : 'http://localhost:3001/orders/'+doc._id
                    }
                }
            }),
            
        });
    }).catch(err =>{
        res.status(500).json({
            error: err
        });
    });
    
}

exports.create_order = (req,res,next) => {
    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // }
    Product.findById(req.body.productId).then(product => {
        if(!product){
            return res.status(404).json({
                message : 'product not found'
            });
        }
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product:  req.body.productId
        })
        return order.save()
    }).then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created order successfully',
            createdOrder: {
                _id : result._id,
                product: result.product,
                quantity: result.quantity
            },
            request : {
                type: 'GET',
                url : 'http://localhos:3001/orders/'+result._id
            }
            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.get_order = (req,res,next) => {
    Order.findById(req.params.orderId).populate('product').exec().then(order => {
        if(!order)
        {
            res.status(404).json({
                message : 'order not found'
            });
        }
        res.status(200).json({
            order : order.id,
            product : order.product,
            request : {
                type: 'GET',
                url : 'http://localhost:3001/orders/'+order.id
            }
        });
    }).catch(err => {
       res.status(500).json({
           error : error
       });
    });
 }

 exports.delete_order = (req,res,next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id : id}).exec().then(result => {
        res.status(200).json({
            message : 'Order deleted',
            request : {
                type : 'POST',
                url: 'http://localhost:3000/orders',
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        });
    })
}