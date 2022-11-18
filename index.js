require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const sgMail = require('@sendgrid/mail')
const { ZingMp3 } = require('zingmp3-api-full')
const download = require('download')
const mongodb = require('./app/config/db')
const route = require('./routers/index')

app.use(cookieParser())

// app.use
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))
app.use(express.json())

const corsOptions = {
  //   origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.get('/searchSong/:search', (req, res) => {
  const { search } = req.params
  ZingMp3.search(search).then((data) => {
    const { encodeId } = data.data.songs[0]
    ZingMp3.getSong(encodeId).then((data) => {
      const file = Object.values(data.data)[0]
      const tmp = file
      const tmp1 = tmp.substr(0, tmp.indexOf('?'))
      console.log(tmp)
      const filename = tmp1.substr(tmp1.lastIndexOf('/') + 1, tmp1.length)
      // const file = 'GFG.jpeg';
      // Path at which image will get downloaded
      const filePath = `${__dirname}/uploads`

      download(file, filePath).then(() => {
        // res.json({ data: filePath + file })
        res.json({ data: filename + '.mp3' })
      })
    })
  })
})

app.post('/mail', (req, res) => {
  console.log(req.body)
  const { email, otp } = req.body
  sgMail.setApiKey(process.env.API_KEY)
  const msg = {
    to: email, // Change to your recipient
    from: 'thailamtruong05@gmail.com', // Change to your verified sender
    subject: 'Chat_bot OTP',
    text: otp,
    html: otp,
  }
  sgMail
    .send(msg)
    .then(() => {
      res.status(200).json({ success: true })
    })
    .catch((error) => {
      res.status(400).json(error)
    })
})

mongodb.connect()
app.post('/register', (req, res) => {
  const { email, pass } = req.body
})

route(app)

app.listen(4000, () => console.log(`Example app listening on port ${4000}!`))
