var lazy_scroll;
var idleTime = 0;

function init(){
  lazy_scroll = new scroll();
}

init();


function manageScrollStop(){
  if(lazy_scroll.getState() == "PLAY"){
    stopScrolling();
    lazy_scroll.setState("PAUSE");
    idleTime = 0;
    idleInterval = setTimeout(timerIncrement,3000); // 5000 milli sec
  }
}
function timerIncrement() {
    idleTime = idleTime + 1;
    console.log("State in increment timer : " + lazy_scroll.getState())
    console.log("idle time : " + idleTime);
    if (idleTime >= 1 && lazy_scroll.getState() == "PAUSE") { // 8000 milli sec
      console.log("Inside if statement");
        clearTimeout(idleInterval);
        lazy_scroll.setSpeed(2);
        lazy_scroll.setDelay(60);
        startScrolling();
    }
}

function scroll(){
	this.state = "STOP";
	this.direction = 1;
	this.speed = 2;
	this.delay = 60;
	this.getState = function(){
		return this.state;
	};
	this.getDirection = function(){
		return this.direction;
	};
	this.getSpeed = function(){
		return this.speed;
	};
	this.getDelay = function(){
		return this.delay;
	};
	this.setSpeed = function(speed){
		this.speed = speed;
	};
	this.setDirection = function(direction){
		this.direction = direction;
	};
	this.setState = function(state){
		this.state = state;
	};
	this.setDelay = function(delay){
		this.delay = delay;
	};

}

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  	console.log("Got message from extension page: " + msg['command']);
  	//document.body.style.backgroundColor="red";
    console.log("Current State : " + lazy_scroll.getState());
  	if(msg['command'] == "toggle-state"){
  		console.log("toggle-state");
  		if(lazy_scroll.getState() == "STOP"){
  			lazy_scroll.setState("PLAY");
  			startScrolling();
        window.addEventListener("mousemove", manageScrollStop);
  		}
      else if(lazy_scroll.getState() == "PAUSE"){
        window.removeEventListener("mousemove", manageScrollStop);
        lazy_scroll.setState("STOP");
        stopScrolling();
      }
  		else{
        window.removeEventListener("mousemove", manageScrollStop);
  			lazy_scroll.setState("STOP");
  			stopScrolling();
  		}
  	}
  	else if(msg['command'] == 'reverse-dir'){
  		if(lazy_scroll.getState() == "PLAY"){
  			console.log("Reverse direction");
  			lazy_scroll.setDirection(lazy_scroll.getDirection() * -1);
  			stopScrolling();
  			startScrolling();
  		}
		else if(lazy_scroll.get_state() == "PAUSE"){
			lazy_scroll.setDirection(lazy_scroll.getDirection() * -1);
		}
  		
  	}
  	else if(msg['command'] == "increase-speed"){
  		if(lazy_scroll.getState() == "PLAY"){
  			console.log("Increase speed");
        stopScrolling();
  			lazy_scroll.setSpeed(lazy_scroll.getSpeed() + 1);
  			lazy_scroll.setDelay(lazy_scroll.getDelay + 60);
  			
  			startScrolling();
  		}
  	}
  	else if(msg['command'] == "decrease-speed"){
  		if(lazy_scroll.getState() == "PLAY" && (lazy_scroll.getSpeed() - 1) > 0){
  			console.log("Decrease speed");
        stopScrolling();
        if(lazy_scroll.getSpeed() >= 2){
          lazy_scroll.setSpeed(lazy_scroll.getSpeed() - 1);
          lazy_scroll.setDelay(lazy_scroll.getDelay - 60);
        }
  			
  			startScrolling();
  		}
  	}
  	else{
  		if(lazy_scroll.getState() == "PLAY"){
  			console.log("State : " + lazy_scroll.getState());
  			lazy_scroll.setState("STOP");
  			stopScrolling();
  			direction = 1;
  		}
  	}
});

function startScrolling(){
  lazy_scroll.setState("PLAY");
	console.log("Start Scrolling function : " + lazy_scroll.getSpeed() + " : " + lazy_scroll.getDelay());
	var height = window.pageYOffset;
	var scrollVal = lazy_scroll.getDirection() * lazy_scroll.getSpeed();
	window.scrollBy(0, scrollVal); 
	scrolldelay = setTimeout("startScrolling()",lazy_scroll.getDelay()); // scrolls every 100 milliseconds
}

function stopScrolling(){
	console.log("Stop scrolling function");
  lazy_scroll.setState("STOP");
	clearTimeout(scrolldelay);
}





