const express = require("express");
const { OrderModel } = require("../../model/orders/order");
const { OrderItemModel } = require("../../model/orders/orderItem");
const router = express.Router();
const jwt = require("jsonwebtoken");

// const jwt_decode = require("jwt-decode");
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThmODc5M2Q2NDBkYTUwNzEyZDlmZjgiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjM4NDM4ODIwLCJleHAiOjE2Mzg1MjUyMjB9.O8qNdNfBsEWtE1ebFDc60mrzidjRyOpjM2JnL0eP18w";
// // var decoded = jwt_decode(token);
// // console.log(decoded.userId);

// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThmODc5M2Q2NDBkYTUwNzEyZDlmZjgiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjM4NDM4ODIwLCJleHAiOjE2Mzg1MjUyMjB9.O8qNdNfBsEWtE1ebFDc60mrzidjRyOpjM2JnL0eP18w";
// const decoded = jwt.decode(token, { complete: true });
// console.log(decoded.payload.userId);

router.get(`/`, async (req, res) => {
  const orderList = await OrderModel.find()
    .populate(["user", "shipingMethod", "orderItems"])
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
    // .populate("user", "name")
    // .populate({
    //   path: "orderItems",
    //   populate: {
    //     path: "product",
    //     populate: "category",
    //   },
    // });
    .populate("user")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "catg",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.post("/", async (req, res) => {
  const orderItemsIds = await Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItemModel({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const totalPrices = await Promise.all(
    orderItemsIds.map(async (orderItemId) => {
      const orderItem = await OrderItemModel.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  const token = req.header("authorization").substring(7);
  const decodedToken = jwt.decode(token, { complete: true });
  const userId = decodedToken.payload.userId;

  let order = new OrderModel({
    orderItems: orderItemsIds,
    status: req.body.status,
    totalPrice: totalPrice,
    user: userId,
  });
  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
});

router.put("/:id", async (req, res) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      shipingMethod: req.body.shipingMethod,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("the order cannot be update!");

  res.send(order);
});

// // router.delete('/:id', (req, res)=>{
// //     Order.findByIdAndRemove(req.params.id).then(async order =>{
// //         if(order) {
// //             await order.orderItems.map(async orderItem => {
// //                 await OrderItem.findByIdAndRemove(orderItem)
// //             })
// //             return res.status(200).json({success: true, message: 'the order is deleted!'})
// //         } else {
// //             return res.status(404).json({success: false , message: "order not found!"})
// //         }
// //     }).catch(err=>{
// //        return res.status(500).json({success: false, error: err})
// //     })
// // })

// // router.get('/get/totalsales', async (req, res)=> {
// //     const totalSales= await Order.aggregate([
// //         { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
// //     ])

// //     if(!totalSales) {
// //         return res.status(400).send('The order sales cannot be generated')
// //     }

// //     res.send({totalsales: totalSales.pop().totalsales})
// // })

// // router.get(`/get/count`, async (req, res) =>{
// //     const orderCount = await Order.countDocuments((count) => count)

// //     if(!orderCount) {
// //         res.status(500).json({success: false})
// //     }
// //     res.send({
// //         orderCount: orderCount
// //     });
// // })

router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await OrderModel.find({ user: req.params.userid })
    .populate([
      "user",
      {
        path: "orderItems",
        populate: {
          path: "product",
          populate: "catg",
        },
      },
    ])
    .sort({ dateOrdered: -1 });

  //   const price = userOrderList.orderItems[0].product.price;
  //   console.log(price);

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

module.exports = router;
