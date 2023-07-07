import { Injectable } from "@nestjs/common";

const fs = require('fs');
const path = require('path');


export function logData(result,req, message, statusCode,status=false){
    let emptyCheck = true
    let  logPath = 'logs'
    let  extension = '.txt'
    let file =  "log-"+ getDate()
    const fullPath = `${logPath}/${file}${extension}`
    let responseBody = JSON.stringify(result)
    let requestBody = JSON.stringify(req.body)
    let requestHeaders = JSON.stringify(req.headers)
    let route = JSON.stringify(req.route)
   
    let data = {
        RequestHeaders:  requestHeaders + "\n\r",
        RequestRoute:  route  + "\r\n",
        path: req.originalUrl + "\n\r",
        RequetBody : requestBody  + "\r\n",
        RequestResponse: responseBody + "\n\r",
        Message: message + "\n\r",
        StatusCode: statusCode,
        Status: status
    }

//    let dataArray = [requestHeaders,route,req.originalUrl,requestBody,responseBody,statusCode,status]

    if(!fs.existsSync(path.join(__dirname, 'logs'))){
        fs.mkdir(path.join(__dirname, 'logs'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    if(fs.existsSync(fullPath)){
        emptyCheck = checkEmptyFile(fullPath)
    }
    if(emptyCheck){
        console.log(data)
        fs.writeFile(fullPath, JSON.stringify(data),(err)=>{
            if(err) { console.error(err); return}
                return;
        });
    }else{
 
        fs.appendFile(fullPath, '\n\n', (err)=>{
        if(err) { console.error(err); return}
            return;
        })
        fs.appendFile(fullPath, JSON.stringify(data), (err)=>{
        if(err) { console.error(err); return}
            return;
        })
    }
}


export function logErrors(err){
    let emptyCheck = true
    let  logPath = 'logs'
    let  extension = '.txt'
    let file =  "log-"+ getDate()
    const fullPath = `${logPath}/${file}${extension}`
    let error = err.stack

    if(!fs.existsSync(path.join(__dirname, 'logs'))){
        fs.mkdir(path.join(__dirname, 'logs'), (err) => {
            if (err) {
                console.error(err);
            }
        });
        
    }

    if(fs.existsSync(fullPath)){
        emptyCheck = checkEmptyFile(fullPath)
    }

    if(emptyCheck){
        fs.writeFile(fullPath, error,(err)=>{
            if(err) { console.error(err); return}
                return;
        });
    }else{
        fs.appendFile(fullPath, '\n\r', (err)=>{
        if(err) { console.error(err); return}
            return;
        })
        fs.appendFile(fullPath, error, (err)=>{
        if(err) { console.error(err); return}
            return;
        })
    }
}

    
const getDate=()=>{
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2);
    
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
    // current year
    let year = date_ob.getFullYear();
    const date  = `${year}-${month}-${day}`
    return date
}

const  checkEmptyFile=(file)=>{
return  fs.readFile(file, (err, file) => {
    let empty =false
    if(file.length == 0){
        empty= true
    }
    return empty
})

}
   

