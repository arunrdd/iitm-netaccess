chrome.browserAction.onClicked.addListener(function(tab) {

	// post('http://netaccess.iitm.ac.in',{
	// 	"userLogin":localStorage.RollNumber,
	// 	"userPassword":localStorage.Password},"post");
	if(localStorage.RollNumber===undefined || localStorage.Password===undefined ){
		chrome.tabs.create({url: "options.html"});
	}
	else{
	chrome.tabs.create({ url: "https://netaccess.iitm.ac.in/account/login" },function(){
		chrome.tabs.query({url:"https://netaccess.iitm.ac.in/account/login"},function(tab){
					exec = "document.getElementById('username').value='"+localStorage.RollNumber+"';document.getElementById('password').value='"+localStorage.Password+"';document.getElementById('submit').click();";
					chrome.tabs.executeScript(tab[0].id,
		        	{code:exec});
		});
		    setTimeout(function(){
	chrome.tabs.create({ url: "https://netaccess.iitm.ac.in/account/approve" },function(){
				chrome.tabs.query({url:"https://netaccess.iitm.ac.in/account/approve"},function(tab){

						if(localStorage.activation==1){
			 			exec = "document.getElementById('radios-0').checked=true;setTimeout(function(){document.getElementById('approveBtn').click();},50);";
			 			}
			 			else{
			 			exec = "document.getElementById('radios-1').checked=true;setTimeout(function(){document.getElementById('approveBtn').click();},50);";
			 			}
						chrome.tabs.executeScript(tab[0].id,
			        	{code:exec});
			     		setTimeout(function(){
			     			chrome.tabs.query({url:"https://netaccess.iitm.ac.in/account/index"},function(tabs){
			     				if (tabs.length == 0){
			     					chrome.tabs.create({url: "options.html"});
			     					setTimeout(function(){
			     						chrome.tabs.query({url:"options.html"},function(tabs){
			     							alert("Invalid Login Details. Please Check!");
			     						});
			     					},100);
			     					chrome.tabs.query({url:"https://netaccess.iitm.ac.in/account/login"},function(tabs){
			     						chrome.tabs.remove(tabs[0].id,function(){

					    	});
					    	chrome.tabs.remove(tabs[1].id,function(){

					    	});
			     					});
			     					// console.log('Invalid Login Details. Please Check!');
			     				}
			     				else{
					    	chrome.tabs.remove(tabs[0].id,function(){

					    	});
					    	chrome.tabs.remove(tabs[1].id,function(){

					    	});
					    }
							});
			        	},2000);
				});
 			});
        	},4000);

	});
}
});
