/*
 * @Author: w
 * @Date: 2019-08-10 15:47:29
 * @LastEditors: w
 * @LastEditTime: 2019-08-10 16:49:23
 */
const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');



app.use('/client',function(req,res,next){
	console.log("请求的req.url",req.url);
	next();
});

app.use('/update',(req,res,next)=>{

})

app.use('/client',express.static(path.join(__dirname, 'client'))); 



var server = app.listen(888,()=>{
	var host = server.address().address;
	var port = server.address().port;
	console.log(`host:${host},port"${port}`);
})




