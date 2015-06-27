jQuery(document).ready(function(e) {
    
	$("#icon-menu").click(function(){
		$("#menu-container").slideToggle("slow");	
	});
	
	$(".logo img").click(function(){
		$("#logo_text").slideToggle("slow");	
	});
	
	$("#serach-icon").click(function(){
		$("#serach-icon").hide("slow");	
		$(".search-fld").slideToggle("slow");	
	});
	
});