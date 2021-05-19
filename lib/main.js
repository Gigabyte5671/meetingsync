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
      params.time = meetingTime.getHours().toString();
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
    params.zone += query.substr(11,4); //The next four numbers in the query are the meeting creator's timezone
    params.title = decodeTitle(query.substr(15,query.length - 1)); //The rest of the query encodes the meeting title
    
    //Update the DOM
    document.getElementById("create-meeting").classList.add("hidden");
    document.getElementById("title").innerHTML = params.title;
    document.getElementById("time").innerHTML = params.time;
    document.getElementById("time").classList.remove("hidden");
    document.getElementById("date").innerHTML = params.day + ordinal(params.day) + " of " + params.month;
    document.getElementById("date").classList.remove("hidden");
    document.getElementById("year").innerHTML = params.year;
    document.getElementById("year").classList.remove("hidden");
    document.getElementById("share-meeting").setAttribute("data-clipboard-text", window.location.origin + "/?t=" + query.toString());;
    document.getElementById("share-meeting").classList.remove("hidden");
  }else{
    //window.location.replace("/create/"); //Go to the create page
  }
}

function encodeQuery(){
  if(document.getElementById("input-date").value == ""){
    alert("Please enter a date.");
  }else{
    if(document.getElementById("input-title").value == ""){
      params.title = "Untitled Meeting";
    }else{
      params.title = document.getElementById("input-title").value;
    }
    params.day = document.getElementById("input-date").value.substr(8,2);
    params.month = months[parseInt(document.getElementById("input-date").value.substr(5,2))];
    params.year = document.getElementById("input-date").value.substr(0,4);
    //Format the time string nicely
    if(document.getElementById("input-hour").value.length < 2){
      params.time = "0" + document.getElementById("input-hour").value;
    }else{
      params.time = document.getElementById("input-hour").value;
    }
    if(document.getElementById("input-minute").value.length < 2){
      params.time += ":0" + document.getElementById("input-minute").value;
    }else{
      params.time += ":" + document.getElementById("input-minute").value;
    }
    var newQuery = dateToUnixTime();
    newQuery = new Date(newQuery + parseInt(Math.floor(new Date().getTimezoneOffset() * 60).toString())).getTime().toString(); //Add the user's timezone offset
    if(Date().substr(28,1) == "-"){
      newQuery += "0";
    }else{
      newQuery += "1";
    }
    newQuery += Date().substr(29,4);
    newQuery += encodeTitle(params.title);
    console.log("Meeting Link:");
    console.log(window.location.origin + "/?t=" + newQuery);
    document.getElementById("output-link-text").value = window.location.origin + "/?t=" + newQuery;
    document.getElementById("output-link-text").innerHTML = window.location.origin + "/?t=" + newQuery;
    document.getElementById("output-link-open").href = window.location.origin + "/?t=" + newQuery;
    document.getElementById("output-link").classList.remove("hidden");
  }
  
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
  var m;
  if(months.indexOf(params.month).toString().length < 2){
    m = "0" + months.indexOf(params.month);
  }else{
    m = months.indexOf(params.month);
  }
  //Required format: 1995-12-17T03:24:00
  return Math.floor(new Date(params.year + "-" + m + "-" + params.day + "T" + params.time + ":00").getTime() / 1000);
}

var clipboard1 = new ClipboardJS("#output-link-copy"); //Initialize the ClipboardJS function
clipboard1.on("success", function(event){
  console.log("Copied Link: " + event.text);
  document.getElementById("output-link-copy").classList.add("hidden");
  document.getElementById("output-link-copy-success").classList.remove("hidden");
  document.getElementById("output-link-copy-success").addEventListener("animationend", function(){
    document.getElementById("output-link-copy-success").classList.add("hidden");
    document.getElementById("output-link-copy").classList.remove("hidden");
  });
});
var clipboard2 = new ClipboardJS("#share-meeting"); //Initialize the ClipboardJS function
clipboard2.on("success", function(event){
  console.log("Copied Link: " + event.text);
  document.getElementById("share-meeting").classList.add("hidden");
  document.getElementById("share-meeting-success").classList.remove("hidden");
  document.getElementById("share-meeting-success").addEventListener("animationend", function(){
    document.getElementById("share-meeting-success").classList.add("hidden");
    document.getElementById("share-meeting").classList.remove("hidden");
  });
});