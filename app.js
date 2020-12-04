const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Telegraf = require('telegraf');

//INSERTADO TOKEN
const bot = new Telegraf('1467289287:AAGKq5OkYFMaRsX6ZqguQD4pBUuybIYpMRI');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const User = require('./models/user');

const app = express();

require('./dbConfig');

app.use(bot.webhookCallback('/secret-path'));
// Modifica la URL
bot.telegram.setWebhook('https://098d29323877.ngrok.io/secret-path');

app.post('/secret-path', (req, res) => {
  res.end('Finaliza petición')
})

bot.use(async (ctx, next) => {

  const user = {
    id: ctx.message.from.id,
    username: ctx.message.from.username,
    first_name: ctx.message.from.first_name,
    last_name: ctx.message.from.last_name
  };


  const usuarios = await User.find({
    id: user.id
  })

  if (usuarios.length === 0) {
    User.create(user).
      then((userInMongo) => console.log(userInMongo))
      .catch(error => console.log(error));

  }
  await next()
});

bot.command('test', (ctx) => {
  ctx.reply('Hola amiguito');
});

bot.command('info', (ctx) => {
  ctx.reply('/test /info /creators');
});
bot.command('creators', (ctx) => {
  ctx.reply(`
  Este es un chatBot creado por los ingenieros de software del Bootcamp Neoland:
  - Lidia Alonso
  - Sofia Martín
  - Alvaro Venegas
  - Juan Miguel Luces  
  `);
});

bot.command('random', async (ctx) => {
  let msg = ctx.message.text;
  msg = msg.slice(7);

  const usuarios = await User.find();
  const usuarioId = usuarios[Math.floor(Math.random() * usuarios.length)].id

  bot.telegram.sendMessage(usuarioId, msg);
  ctx.reply('hemos enviado tu mensaje a un usuario aleatorio, jo jo jo, payaso');

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
