const router = require('koa-router')()
const path=require('path')
const multer = require('koa-multer')
const db = require('../dbConfig')
const upload=require('../upload')

//渲染路由index.pug页面，传入title参数。
router.get('/', async (ctx, next) => {
    let rows = await db.getById('test', 2);
    console.log(rows, 'rows');//[ TextRow { id: 2, name: 'xxx' } ]
    await ctx.render('index', {
        title: rows[0].name
    })
})

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})


router.post('/api/picture/upload.json', async (ctx, next) => {
    let result={success:false};
    let serverFilePath=path.join(__dirname,'image');

    result=await upload.uploadFile(ctx,{
        fileType:'album',
        path:serverFilePath
    })
    ctx.body=result;

})


module.exports = router
