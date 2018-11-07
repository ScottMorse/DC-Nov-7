const express = require('express');
const router = express.Router();
const path = require("path")
const squtils = require("../utils/pgsess")
const bcrypt = require('bcrypt')

const models = require('../models')

const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
const badUserNames = ["info","marketing","sales","support","abuse","noc","security","postmaster","hostmaster","usenet","news","webmaster","www","uucp","ftp","smtp","list","list-request","admin","blog","dev","ftp","mail","pop","pop3","imap","smtp","stage","stats","status","www","beta","about","access","account","accounts","add","address","adm","admin","administration","adult","advertising","affiliate","affiliates","ajax","analytics","android","anon","anonymous","api","app","apps","archive","atom","auth","authentication","avatar","backup","banner","banners","bin","billing","blog","blogs","board","bot","bots","business","chat","cache","cadastro","calendar","campaign","careers","cgi","client","cliente","code","comercial","compare","config","connect","contact","contest","create","code","compras","css","dashboard","data","db","design","delete","demo","design","designer","dev","devel","dir","directory","doc","docs","domain","download","downloads","edit","editor","email","ecommerce","forum","forums","faq","favorite","feed","feedback","flog","follow","file","files","free","ftp","gadget","gadgets","games","guest","group","groups","help","home","homepage","host","hosting","hostname","html","http","httpd","https","hpg","info","information","image","img","images","imap","index","invite","intranet","indice","ipad","iphone","irc","java","javascript","job","jobs","js","knowledgebase","log","login","logs","logout","list","lists","mail","mail1","mail2","mail3","mail4","mail5","mailer","mailing","mx","manager","marketing","master","me","media","message","microblog","microblogs","mine","mp3","msg","msn","mysql","messenger","mob","mobile","movie","movies","music","musicas","my","name","named","net","network","new","news","newsletter","nick","nickname","notes","noticias","ns","ns1","ns2","ns3","ns4","ns5","ns6","ns7","ns8","ns9","ns10","old","online","operator","order","orders","page","pager","pages","panel","password","perl","pic","pics","photo","photos","photoalbum","php","plugin","plugins","pop","pop3","post","postmaster","postfix","posts","profile","project","projects","promo","pub","public","python","random","register","registration","root","ruby","rss","sale","sales","sample","samples","script","scripts","secure","send","service","shop","sql","signup","signin","search","security","settings","setting","setup","site","sites","sitemap","smtp","soporte","ssh","stage","staging","start","subscribe","subdomain","suporte","support","stat","static","stats","status","store","stores","system","tablet","tablets","tech","telnet","test","test1","test2","test3","teste","tests","theme","themes","tmp","todo","task","tasks","tools","tv","talk","update","upload","url","user","username","usuario","usage","vendas","video","videos","visitor","win","ww","www","www1","www2","www3","www4","www5","www6","www7","wwww","wws","wwws","web","webmail","website","websites","webmaster","workshop","xxx","xpg","you","yourname","yourusername","yoursite","yourdomain","about","access","account","accounts","add","address","adm","admin","administration","adult","advertising","affiliate","affiliates","ajax","analytics","android","anon","anonymous","api","app","apps","archive","atom","auth","authentication","avatar","backup","banner","banners","bin","billing","blog","blogs","board","bot","bots","business","chat","cache","cadastro","calendar","campaign","careers","cgi","client","cliente","code","comercial","compare","config","connect","contact","contest","create","code","compras","css","dashboard","data","db","design","delete","demo","design","designer","dev","devel","dir","directory","doc","docs","domain","download","downloads","edit","editor","email","ecommerce","forum","forums","faq","favorite","feed","feedback","flog","follow","file","files","free","ftp","gadget","gadgets","games","guest","group","groups","help","home","homepage","host","hosting","hostname","html","http","httpd","https","hpg","info","information","image","img","images","imap","index","invite","intranet","indice","ipad","iphone","irc","java","javascript","job","jobs","js","knowledgebase","log","login","logs","logout","list","lists","mail","mail1","mail2","mail3","mail4","mail5","mailer","mailing","mx","manager","marketing","master","me","media","message","microblog","microblogs","mine","mp3","msg","msn","mysql","messenger","mob","mobile","movie","movies","music","musicas","my","name","named","net","network","new","news","newsletter","nick","nickname","notes","noticias","ns","ns1","ns2","ns3","ns4","old","online","operator","order","orders","page","pager","pages","panel","password","perl","pic","pics","photo","photos","photoalbum","php","plugin","plugins","pop","pop3","post","postmaster","postfix","posts","profile","project","projects","promo","pub","public","python","random","register","registration","root","ruby","rss","sale","sales","sample","samples","script","scripts","secure","send","service","shop","sql","signup","signin","search","security","settings","setting","setup","site","sites","sitemap","smtp","soporte","ssh","stage","staging","start","subscribe","subdomain","suporte","support","stat","static","stats","status","store","stores","system","tablet","tablets","tech","telnet","test","test1","test2","test3","teste","tests","theme","themes","tmp","todo","task","tasks","tools","tv","talk","update","upload","url","user","username","usuario","usage","vendas","video","videos","visitor","win","ww","www","www1","www2","www3","www4","www5","www6","www7","wwww","wws","wwws","web","webmail","website","websites","webmaster","workshop","xxx","xpg","you","yourname","yourusername","yoursite","yourdomain","supportdetails","support-details","stacks","imulus","github","twitter","facebook","google","apple","about","account","activate","add","admin","administrator","api","app","apps","archive","archives","auth","blog","cache","cancel","careers","cart","changelog","checkout","codereview","compare","config","configuration","connect","contact","create","delete","direct_messages","documentation","download","downloads","edit","email","employment","enterprise","faq","favorites","feed","feedback","feeds","fleet","fleets","follow","followers","following","friend","friends","gist","group","groups","help","home","hosting","hostmaster","idea","ideas","index","info","invitations","invite","is","it","job","jobs","json","language","languages","lists","login","logout","logs","mail","map","maps","mine","mis","news","oauth","oauth_clients","offers","openid","order","orders","organizations","plans","popular","post","postmaster","privacy","projects","put","recruitment","register","remove","replies","root","rss","sales","save","search","security","sessions","settings","shop","signup","sitemap","ssl","ssladmin","ssladministrator","sslwebmaster","status","stories","styleguide","subscribe","subscriptions","support","sysadmin","sysadministrator","terms","tour","translations","trends","unfollow","unsubscribe","update","url","user","weather","webmaster","widget","widgets","wiki","ww","www","wwww","xfn","xml","xmpp","yaml","yml","chinese ","mandarin ","spanish ","english ","bengali ","hindi ","portuguese ","russian ","japanese ","german ","wu ","javanese ","korean ","french ","vietnamese ","telugu ","chinese ","marathi ","tamil ","turkish ","urdu ","min-nan ","jinyu ","gujarati ","polish ","arabic ","ukrainian ","italian ","xiang ","malayalam ","hakka ","kannada ","oriya ","panjabi ","sunda ","panjabi ","romanian ","bhojpuri ","azerbaijani ","farsi ","maithili ","hausa ","arabic ","burmese ","serbo-croatian ","gan ","awadhi ","thai ","dutch ","yoruba ","sindhi"]

//change to having dashboard button instead of log/reg forms , no redirect
router.get('/', (req, res, next) => {
  const uid = req.session.uid
  if(uid){
    res.redirect('/dashboard')
    return
  }
  res.render('index')
})

router.post('/register', (req,res,next) => {
    const email = req.body.regEmail
    const pswd = req.body.regPswd
    const username = req.body.regUsername

    if(email != req.body.confirmEmail)
    {
      res.render('index',{regBlame: "Emails don't match."})
    }
    else if(pswd != req.body.confirmPswd)
    {
      res.render('index',{regBlame: "Passwords don't match."})
    }
    else if(badUserNames.includes(username.toLowerCase()) || username.length < 4)
    {
      res.render('index',{regBlame: 'Username not available.'})
    }
    else if(!email.match(emailRegex))
    {
      res.render('index',{regBlame: 'Invalid email.'})
    }
    else if(pswd.length < 6)
    {
      res.render('index',{regBlame: 'Please use at least 6 characters for password.'})
    }
    else{
      bcrypt.hash(pswd,5)
        .then(hashedPswd => {
          const newUser = models.user.build({
            username: username,
            password: hashedPswd
          })
          newUser.save()
            .then(user => console.log(user))
            .catch(err => console.log(err))
        }).catch(err => console.log(err))
    }

})

router.post('/login',(req,res,next) => {
  // const username = req.body.logUsername
  // const pswd = req.body.logPswd
  // let user
  // db.selectTableAll('users').then(userTableRows => {
  //    userTableRows.forEach(row => {
  //      if(username == row.username){
  //         user = row
  //      }
  //    })
  //    if(!user){
  //     res.render('index',{logBlame: 'Sorry, that username does not exist.'})
  //    }
  //    else{
  //      db.comparePasswords(pswd,user.pswd).then(isMatch => {
  //         if(isMatch){
  //           const sess = req.session
  //           sess.uid = user.id
  //           sess.username = user.username
  //           res.redirect('/dashboard')
  //         }
  //         else{
  //           res.render('index',{logBlame: 'Sorry, incorrect password.'})
  //         }
  //       }
  //     )}
  // })
})

router.post('/logout',(req,res,next) => {
    req.session.destroy()
    res.redirect('../')
})

router.get('/logout',(req,res,next) => {
  req.session.destroy()
  res.redirect('../')
})

router.get('/register',(req,res,next) => {
  res.redirect('/')
})
router.get('/login',(req,res,next) => {
  res.redirect('/')
})

module.exports = router;