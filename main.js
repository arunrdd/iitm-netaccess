(function($){
  var o = $({});

  $.each({
    trigger: 'publish',
    on: 'subscribe',
    off: 'unsubscribe'
  }, function(key, val){
    jQuery[val] = function(){
      o[key].apply(o,arguments);
    };
  });

})(jQuery);


(function($){
  var netAccess = {
    init: function(){
	  this.subscriptions();    
      this.username = '';
      this.password = '';
      this.usageHtml = '';
      this.duration = 1;
      this.notified = false;
      this.details_notified = false;
        
      return this;
    },
    
    subscriptions: function(){
      $.subscribe('netaccess/setLogin',this.setLoginDetails);
      $.subscribe('netaccess/updateUsage',this.updateUsage);
      $.subscribe('netaccess/approve',this.approve);
    },

    start: function(){
    	var self = netAccess;
    	netAccess.login();
    	chrome.browserAction.setBadgeBackgroundColor({color:"#000"});
    },

    login: function(){
    	var self = netAccess;
    	if(netAccess.setDetails()){
	    	chrome.browserAction.setBadgeText({text: "Login"});
	    	var data = {'userLogin':self.username,'userPassword':self.password},
	    		url = "https://netaccess.iitm.ac.in/account/login";
	    	$.ajax({
			  type: "POST",
			  url: url,
			  data: data,
			  success: self.successLogin
			});
    	}
    	else if(self.details_notified==false){
    		chrome.tabs.create({url: "options.html"});
            self.details_notified=true;
    	}
    },

    successLogin: function(html){
    	var self = netAccess;
    	$.parseHTML(html);
    	if($( ".alert",html ).hasClass( "alert-warning" ) && self.details_notified==false){
    		chrome.tabs.create({url: "options.html"},function(){
    			alert('Invalid login details!');
    		});
    	}
    	else{
    		self.usageHtml = html;
    		setTimeout(function(){
    		$.publish('netaccess/approve');	
    		},800);
    	}
    },

    approve: function(){
    	var self = netAccess;
    	chrome.browserAction.setBadgeText({text: "approve"});
    	duration = self.duration.toString();
    	var data = {'duration':duration,'approveBtn':''},
    		url = "https://netaccess.iitm.ac.in/account/approve";
    	$.ajax({
		  type: "POST",
		  url: url,
		  data: data,
		  success: self.successApprove
		});
    },

    successApprove: function(html){
    	setTimeout(function(){
    		chrome.browserAction.setBadgeText({text: "Done!"});
    	},400);
    	setTimeout(function(){
    		$.publish('netaccess/updateUsage');
    	},800);
    },

    updateUsage: function(){
    	var self = netAccess;
    	str = $('.alert-success', self.usageHtml).html();
    	if (str==undefined){
    		chrome.browserAction.setBadgeBackgroundColor({color:"#F00"});
    		chrome.browserAction.setBadgeText({text: ">1GB"});
    	}
    	else{
    		array = str.split(" ");
    		console.log(array);
    		var i,memory,units;
			for (i = 0; i < array.length; ++i) {
    			if(isNaN(array[i]) || array[i]==""){
    				
    			}
    			else{
    				memory = array[i];
    				if (array[i+1].slice(0,1)=="B"){
    					units = "B";
    				}
    				else if (array[i+1].slice(0,1)=="K"){
    					units = "KB";
    				}
    				else if (array[i+1].slice(0,1)=="M"){
    					units = "MB";
    				}
    				else{
    					units = "";
    				}
    				break;
    			}
			}

    		usage = parseInt(memory, 10);
    		if(usage>800 && self.notified == false){
    			alert("You have only "+(1000-usage)+"MB left. Use wisely!");
    			self.notified = true;
    		};
  			chrome.browserAction.setBadgeText({text: usage.toString()+units	});
    	}
    },


    setDetails: function(){
	if(localStorage.RollNumber===undefined || localStorage.Password===undefined ){
		return 0;
	}
	else{
		this.username = localStorage.RollNumber;
		this.password = localStorage.Password;
		if (localStorage.activation==undefined){
			this.duration = 1;
		}
		else{
			this.duration = localStorage.activation;
		}
		return 1;
	}
    },

  };
  window.netAccess = netAccess.init();
  chrome.browserAction.setBadgeBackgroundColor({color:"#000"});
})(jQuery);

// fire the start when user clicks icon
chrome.browserAction.onClicked.addListener(function(tab){
	netAccess.start();  	
});

//start once when loaded
netAccess.start();

// fire an update every 15min
var netaccessInterval = setInterval(netAccess.start, 900000);
