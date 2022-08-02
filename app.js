// app.js
// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') // 引用 body-parser(用來抓取res.body)
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const Restaurant = require("./models/Restaurant")//Restaurant.js的模組

//mongoDB連線設定
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// setting static files
app.use(express.static('public'))

// routes setting
//index
app.get('/', (req, res) => {
  Restaurant.find() // 取出  model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

//create
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

//search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  if (keyword.length === 0) {
    return res.redirect("/")
  }
  Restaurant.find() // 取出  model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => {
      const filterRestaurants = restaurants.filter(restaurant =>
        restaurant.name.includes(keyword) || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
      )
      if (filterRestaurants.length === 0) {
        return res.redirect("/")
      }
      res.render('index', { restaurants: filterRestaurants, keyword: keyword })// 將資料傳給 index 樣板
    })
    .catch(error => console.error(error)) // 錯誤處理
})

//detail(show)
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id) //從資料庫查找特定資料
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//編輯資料頁面的路由
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
//修改特定資料的路由
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByIdAndUpdate(id, req.body) //找到對應的資料後整個一起更新
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//刪除todo的路由
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})