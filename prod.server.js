/**
 * Created by Administrator on 2018/6/22.
 */
const express=require('express');
const config=require('./config/index');
// const port=process.env.PORT||config.build.port;
const app=express();
const router=express.Router();
router.get('/',function (req,res,next) {
  req.url='/index.html';
  next();
});
app.use(router);

// 定义异步接口的router,复制dev配置文件的接口
const appData = require('./data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;
const apiRoutes = express.Router();
 apiRoutes.get('/seller', (req, res) => {
  res.json({
    // 这里是你的json内容
    errno: 0,
    data: seller
  })
});
  apiRoutes.get('/goods', (req, res) => {
    res.json({
      // 这里是你的json内容
      errno: 0,
      data: goods
    })
  });
   apiRoutes.get('/ratings', (req, res) => {
    res.json({
      // 这里是你的json内容
      errno: 0,
      data: ratings
    })
  });
app.use('/api', apiRoutes);
// 定义static目录
app.use(express.static('./dist'));
// 启动express
module.exports = app.listen(9000, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:9000'+ '\n')
});
