var drcom = {};
drcom.config = { disableJs: false };
drcom.config.framework = {
		isPreventDefault : false,
        previewOn: false, //edit here
		animationPreview: false,
        continuous: true,
        assets: '../assets',
        presentationName: 'VIMOVO MASTER Harvie',
        slideJSON: "../slides.json",
        webviews: {
            content: { width: 1024, height: 768 },
            preview: { width: 1024, height: 768 },
            menu: { width: 1024, height: 135 }
        },
        playerControl: "oldbrowser",
        screencapPath: "presentation/screencap/%assetname%.jpg",//edit here
        disableSwipe: '.ui-draggable'
    
};

drcom.config.menu = {
    thumbPath: "../%assetname%/thumbs/thumb.png",
    autoHide: {
        main: false 
    },
    
    includeSelf: false,
    startFromBottom: true,
     menuType: 'BarSubMenu', // 'BarDotMenu' , 'BarSubMenu' , 'SubDotMenu'
      
    menus: {
        main: "../flows/menu.json"      
    }
};


drcom.config.events = {
	swipeMode: "swipeone",
	fastSwipeOption: {
	length: 100 
	}
};


