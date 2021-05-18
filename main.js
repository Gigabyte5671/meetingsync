var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
var characters = ["","","","","","","","","",""," ","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","!","@","#","$","%","^","&","*","(",")","-","_","=","+","[","{","]","}","|",";",":","<",".",">","/","?","~"]; //100 allowable characters for the title
var query = "";
var success = 0;
var params = {
  "title":  "",
  "year":   "",
  "month":  "",
  "day":    "",
  "time":   "",
  "zone":   ""
}
function ordinal(num){
  var ord = "th";
  num = parseInt(num.toString().split('').pop());
  if(num === 1){
    ord = "st";
  }else if(num === 2){
    ord = "nd";
  }else if(num === 3){
    ord = "rd";
  }
  return ord;
}

query = location.search;

function decodeQuery(){
  if(query != ""){ //If there is a query in the page URL
    query = query.split("=")[1]; //Get the query data
    
    var meetingTime = new Date(parseInt(query.substr(0,10) + "000")); //Create a Date object from the Unix Timestamp
    meetingTime = new Date(meetingTime.getTime() - parseInt(Math.floor(new Date().getTimezoneOffset() * 60).toString() + "000")); //Subtract the user's timezone offset
    
    params.year = meetingTime.getFullYear().toString(); //Get the year of the meeting
    params.month = months[meetingTime.getMonth()]; //Get the month of the meeting
    params.day = meetingTime.getDate().toString(); //Get the day of the meeting
    
    //Format the time string nicely
    if(meetingTime.getHours().toString().length < 2){
      params.time = "0" + meetingTime.getHours().toString();
    }else{
      params.time = meetingTime.getHours().toString()
    }
    if(meetingTime.getMinutes().toString().length < 2){
      params.time += ":0" + meetingTime.getMinutes().toString();
    }else{
      params.time += ":" + meetingTime.getMinutes().toString();
    }
    
    //The 11th number in the query encodes the sign of the meeting creator's timezone
    if(query.substr(10,1) == "0"){
      params.zone = "-";
    }else if(query.substr(10,1) == "1"){
      params.zone = "+";
    }else{
      //Error
    }
    params.zone += query.substr(11,2); //The next two numbers in the query are the meeting creator's timezone
    params.title = decodeTitle(query.substr(13,query.length - 1)); //The rest of the query encodes the meeting title
    
    console.log(params);
    
    //Update the DOM
    document.getElementById("title").innerHTML = params.title.split("_").join(" ");
    document.getElementById("time").innerHTML = params.time;
    document.getElementById("date").innerHTML = params.day + ordinal(params.day) + " of " + params.month;
    document.getElementById("year").innerHTML = params.year;
    
    
    if(success === 0){ //If the query couldn't be parsed
      console.log("Break 1");
      //window.location.replace("/"); //Go to the default page
    }
  }else{
    console.log("Break 2");
    //window.location.replace("/"); //Go to the default page
  }
}

function encodeQuery(){
  
}

function encodeTitle(title){
  var output = "";
  title.split("").forEach(function(character){ //For every character in the requested title
    if(characters.includes(character)){ //If that character is in the characters array
      output += characters.indexOf(character).toString(); //Include the character's index in the encoded output
    }else{
      //Warning
    }
  });
  return output;
}
function decodeTitle(encodedTitle){
  var title = "";
  encodedTitle.match(/.{2}/g || []).forEach(function(character){ //For every pair of characters
    title += characters[character]; //Find that character in the characters array
  });
  return title;
}


function getCurrentUnixTime(){
  //Compatibility shim
  //if (!Date.now) {
  //  Date.now = function() { return new Date().getTime(); }
  //}
  return Math.floor(Date.now() / 1000); //Return the current Unix Timestamp without milliseconds
}

function dateToUnixTime(date){
  return Math.floor(new Date("1995-12-17T03:24:00").getTime() / 1000);
}