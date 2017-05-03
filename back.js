var former = console.log;
      console.log = function(msg){
          former(msg);  //maintains existing logging via the console.
          $("#mylog").append("<div>" + msg + "</div>");
      };
      
      window.onerror = function(message, url, linenumber) {
          console.log("JavaScript error: " + message + " on line " + 
                  linenumber + " for " + url);
      };

console.log("test");