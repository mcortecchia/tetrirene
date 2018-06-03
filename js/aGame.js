var theCanvas;
var srcWidth = 320;
var srcHeight = 456;

var frameCount = 0;
var randCircSizeMin = 10;
var randCircSizeMax = 50;
var gameTime = 0;
var lastTick = 0;
var levelUpSeconds = 30;
var _theGrid = new JGrid(
	12,  //Larghezza griglia
	24, //Altezza griglia
	16  //Dimensione blocchi griglia in pixel
);

var _scale = 1;
var lastKeycode = '';


	
function randomBackground() {
	
	var num = Math.floor(Math.random()* 6) + 1;
	$("body").css("background-image", "url('./background"+num.toString()+".png')")
}

function stopScrolling( touchEvent ) { touchEvent.preventDefault(); }
document.addEventListener( 'touchstart' , stopScrolling , false );
document.addEventListener( 'touchmove' , stopScrolling , false );

/*document.onselectstart = function( e ) { 
  e.preventDefault();
  return false;
};*/


var isiOS = false;
var agent = navigator.userAgent.toLowerCase();
if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0){
       isiOS = true;
}



$(window).resize( function() {
	if ($("#theCanvas").size() > 0) {
	
		var offset = { left:0, top: 0 };
		var scaleX = $(window).width()/srcWidth;
		var scaleY = $(window).height()/srcHeight;
		_scale = scaleX<scaleY?scaleX:scaleY;
		$("#theCanvas").width(srcWidth*_scale);	
		$("#theCanvas").height(srcHeight*_scale);	
		
		offset.left = ($(window).width() - $("#theCanvas").outerWidth()) / 2;
		offset.top = ($(window).height() - $("#theCanvas").outerHeight()) / 2;	
		
		$("#theCanvas").offset(offset);
	}
});


function switchFullScreen() {
	if ($.fullscreen.isFullScreen())
	{
		$.fullscreen.exit()
	}
	else {
		$("body").fullscreen();
	}
}

function makeUnselectable(node) {
    if (node.nodeType == 1) {
        node.unselectable = true;
    }
    var child = node.firstChild;
    while (child) {
        makeUnselectable(child);
        child = child.nextSibling;
    }
}


$(document).ready(function(){
	/* 	INITIALIZATION AREA - BEGIN
	*	Canvas setup and run loop are defined here.
	*/

	randomBackground();


	$(window).keydown( function(event) {
		lastKeycode = event.keyCode;
		_theGrid.setKeyDown(lastKeycode);
	});
	
	
	$("#theCanvas")
		.attr('width',srcWidth)
		.attr('height',srcHeight);
	
	/* Set click events to the buttons - BEGIN */
	$("#btnProfiler").click(function(){
		theCanvas.toggleProfiler();
	});	
	
	/* Set click events to the buttons - END */
	$("#btnProfiler").hide();
	
	$("#theCanvas").each(function(){
		// Keep a handle on the canvas
		theCanvas = this;
		makeUnselectable(theCanvas);
		theCanvas.onselectstart = function () { return false; }

		jck(this,
		{
			fullscreen : false,
			framerate :  20,
			autoUpdate : true,
			autoClear : true,
			sampleFrames : true,
			autoUpdateProfiler : false
		});
		
		
		_theGrid.position = {
			x: ($("#theCanvas").width() - _theGrid.gridWidth  *_theGrid.rectSize) -25, 
			y: ($("#theCanvas").height() - _theGrid.gridHeight *_theGrid.rectSize) - 55 
		} 
		_theGrid.updateAreas();
		this.createProfiler();
		
		/* 	Add the values to be shown in the profiler.  These must be explicitly passed 
			to the updateProfiler() function each frame to be kept up to date. */ 
		this.addProfilerValue([
			{	
				label : "frameCount",
				value : frameCount
			},
			{
				label : "lastKey",
				value : lastKeycode
			},
			{
				label : "level",
				value : _theGrid.level
			},
				{
					label : "score",
					value : _theGrid.score
				}
		]);
		
		gameTime = now().getTime();
		lastTick = gameTime;
		// Define the run loop.  It already exists, but override it to draw stuff
		this.runloop = function(){
			gameTime = now().getTime();
			var msTime = gameTime - lastTick;
			
			if (msTime > 0) {
				lastTick = gameTime;
				_theGrid.update(msTime);		
			
				
				
			}
			
			frameCount++;
				
			// Feed the live values back into the canvas's profiler so they can be output
			this.updateProfiler([
				{	
					label : "frameCount",
					value : frameCount
				},
				{
					label : "lastKey",
					value : lastKeycode
				},
				{
					label : "level",
					value : _theGrid.level
				},
				{
					label : "score",
					value : _theGrid.score
				}
			]);
			
			_theGrid.draw();
		};	
	});
	
	function getCursorPosition(e) {
		var x;
		var y;
		if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
		}
		else {
		x = e.clientX + document.body.scrollLeft +
				document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop +
				document.documentElement.scrollTop;
		}
		
		if ((x<=0) || (y<=0)) {
			x = event.targetTouches[0].pageX;
			y = event.targetTouches[0].pageY;
		}
		
		x -= theCanvas.offsetLeft;
		y -= theCanvas.offsetTop;

		var Point = {
			x: x,
			y: y
			};
		return Point;
	}

	
	$(window).trigger('resize');
	/* 	INITIALIZATION AREA - END */
		$("#theCanvas").bind("click tap", function(e) {
			var pt = getCursorPosition(e);
			pt = {
					x: pt.x * ( srcWidth / $("#theCanvas").width()), 
					y: pt.y  * ( srcHeight / $("#theCanvas").height())
				};
			_theGrid.handleClick(pt);
			e.preventDefault();
		});
});

var objectsDefinitions = new Array();

objectsDefinitions.push(['#4dbd03',3,
	0,1,0,
	0,1,1,
	0,1,0
	]);
	
objectsDefinitions.push(['#ff0000',3,
	0,1,0,
	0,1,0,
	0,1,0,
	0,1,0
	]);
	
objectsDefinitions.push(['#0243d1',2,
	1,1,
	1,1	
	]);
	
objectsDefinitions.push(['#d805dd',3,
	0,1,0,
	0,1,0,
	0,1,1
	]);
	
objectsDefinitions.push(['#c7d719',3,
	0,1,0,
	0,1,0,
	1,1,0
	]);
	
objectsDefinitions.push(['#ff9200',3,
	1,1,0,
	0,1,1
	]);
		
objectsDefinitions.push(['#06b598',3,
	0,1,1,
	1,1,0
	]);
	
	
	

function JGrid(gridWidth, gridHeight, rectSize) {
	this.level = 0;
	this.stepSpeed = 800;
	this.dieingSpeed = 500;
	this.stepAmount = 0;
	this.gridWidth = gridWidth;
	this.gridHeight = gridHeight;
	this.rectSize = rectSize;
	this.live = null;
	this.linescleared = 0;
	this.linestocleartogo = 10;
	this.score=0;
	this.nextobj = null;
	
	var areaWidth = 280;
	var left = (320 - areaWidth) *.5;
	var rectdown = {
		x:left, 
		y: 456 - 50,
		width: areaWidth/4,
		height: 50
	},rectright = {
		x:left + areaWidth/4*3, 
		y: 456 - 50,
		width: areaWidth/4,
		height: 50
	},rectleft = {
		x:left + areaWidth/4*2, 
		y: 456 - 50,
		width: areaWidth/4,
		height: 50
	},rectrotate = {
		x:left + areaWidth/4, 
		y: 456 - 50,
		width: areaWidth/4,
		height: 50
	},reactArea = {
		x: 0-1,
		y: 0-1, 
		width: this.gridWidth*this.rectSize +1,
		height: this.gridHeight*this.rectSize +1
	}, rectfullscreen = {
		x:left, 
		y: 456 - 110,
		width: areaWidth/4,
		height: 50
	}
	rectlevel = {
		x:left-2, 
		y: 85,
		width: areaWidth/4,
		height: 50
	}
	
	this.updateAreas = function() {
		reactArea = {
			x: this.position.x-1,
			y: this.position.y-1, 
			width: this.gridWidth*this.rectSize +1,
			height: this.gridHeight*this.rectSize +1
		}
	}
	
	this.isInRect = function(pt,rect) {
		if ((rect.x <= pt.x) && ( pt.x <= (rect.x + rect.width)) &&
			(rect.y <= pt.y ) && (pt.y <= (rect.y + rect.height))) {
			return true;
	    }
		
		return false;
	} 
	
	this.handleClick = function(pt) {


		console.log('handle click on ' + pt.x + ',' +pt.y);
		if (this.isInRect(pt, rectrotate) == true) {
			this.setKeyDown('38');
		}
		else if (this.isInRect(pt, rectleft) == true) {
			this.setKeyDown('37');
		}
		else if (this.isInRect(pt, rectright) == true) {
			this.setKeyDown('39');
		}
		else if (this.isInRect(pt, rectdown) == true) {
			this.setKeyDown('40');
		}
		else if (this.isInRect(pt, reactArea) == true)  {
			this.setKeyDown('32');
		}
		else if (this.isInRect(pt, rectfullscreen) == true)  {
			switchFullScreen();
		}
	}
	
	this.levelUp = function() {
		this.level++;
		this.dieingSpeed *= 0.80;
		this.stepSpeed *= 0.80;
		randomBackground();
	}
	
	var stIngame = 1, stStartMenu = 0, stGameOver = 2, stPausing = 3;
	
	this.status = stIngame;  
	this.dieing = false;
	this.soldedblocks = new Array();

	this.randomObject = function() {
		var num = Math.floor(Math.random()* objectsDefinitions.length);
		return new liveObject(this,objectsDefinitions[num]);
	}


	
	this.update = function(msTime) {
	
		if (this.status == stIngame) {
			this.stepAmount += msTime;
						
			if (!this.dieing) {
				
				this.handleKeyDown(this._lastkey);
				this._lastkey='';
				
				if (this.nextobj == null) {
					this.nextobj = this.randomObject();
				}
				
				if (this.live == null) {
					var num = Math.floor(Math.random()* objectsDefinitions.length);
					this.live = this.nextobj;
					this.live.position = { x:5, y:0 };
				
					this.nextobj= this.randomObject();
					this.nextobj.position = { x: - 2 - (this.nextobj.width)/2
							, y:  + 3 - (this.nextobj.height)/2 
					};
					this.nextobj.updateBlockPos();
					
					while (!this.live.validate() && this.live.canStepDown())
						this.live.stepDown();				
					
					this.stepAmount = 0;
				}
				
				
				
				if (!this.live.canStepDown() && !this.live.validate()) {
					//alert('game over');
					this.status = stGameOver;
				}
				
				if (this.stepAmount >= this.stepSpeed)
				{
					this.removeDied();
					this.stepAmount -= this.stepSpeed;
					this.live.stepDown();			
				}
				 
				if (this.live != null)
					this.live.update();
			}
			else {
				if (this.stepAmount >= this.dieingSpeed)
				{
					this.removeDied();
					this.stepAmount = 0;
					this.dieing = false;
				}
			}
		}
	}
	
	this.removeDied = function() {
	
	   var sb = this.soldedblocks;
	   var dr = this.diedRows;
	   var points = 0;	
		for (var r=dr.length-1; r>=0; r--) {
			var row = dr[r];

			for (var i=sb.length-1; i>=0; i--) {
			   	if (sb[i].position.y == row) {
					sb.splice(i,1);				
				}
			}

			for (var i=sb.length-1; i>=0; i--) {
			   	if (sb[i].position.y < row) {
					sb[i].position.y++;				
				}
			}		

			this.linescleared ++;
			points = (points*2) + 10;
		}
		
		if (this.linescleared>=this.linestocleartogo)
		{
			this.levelUp();
			this.linescleared %= this.linestocleartogo;
		}
		
		dr.splice(0,dr.length);
		
		this.score += points
	}
	
	var game = this;

	levelUpCycle = function() {
		window.setTimeout(function() { 
			game.levelUp(); 
			levelUpSeconds *= 1.5;
			levelUpCycle();
		}, levelUpSeconds*1000);
	}
	
	levelUpCycle();

	this.position = {
		x : 0,
		y : 0
	}
	
	this._lastkey = '';
	this.setKeyDown = function(key) {
		this._lastkey = key;
	}
	
	
	this.handleKeyDown = function(keyCode) {
		if (this.status == stIngame) {
			if (this.live!=null) {
				if (keyCode == '37') {
					this.live.stepLeft();
				}
				else if (keyCode == '39') {
					this.live.stepRight();
				}
				else if (keyCode == '40') {                       
					this.live.stepDown();
					this.stepAmount = 0;
				}
				else if (keyCode == '38') {
					this.live.rotate90acw();
				}
				else if (keyCode == '32') {
					if (this.live.canStepDown()){
						while (this.live.canStepDown())
							this.live.stepDown();
						
						this.stepAmount = this.stepSpeed;
					}
				}
			}
		}
	}
	
	this.draw = function() {
		
		theCanvas.context.beginPath();
		theCanvas.context.rect(this.position.x-1,this.position.y-1, this.gridWidth*this.rectSize +1,this.gridHeight*this.rectSize +1);
		theCanvas.context.rect(this.position.x-1-this.rectSize*5,this.position.y-1, 4*this.rectSize +1, 4*this.rectSize +1);
		theCanvas.context.rect(this.position.x-1-this.rectSize*5,this.position.y-1 + this.rectSize*5, 4*this.rectSize +1, 4*this.rectSize +1);
		
		theCanvas.context.strokeStyle = 'rgba(255,255,255,0.5)';
		theCanvas.context.fillStyle = "rgba(0, 0, 0, 0.3)";
		theCanvas.context.lineWidth = 2;
		theCanvas.context.stroke();
		theCanvas.context.fill();
		theCanvas.context.closePath();
		
		theCanvas.context.beginPath();
		
		var margin =5;
		theCanvas.context.rect(rectrotate.x+margin,rectrotate.y+margin,rectrotate.width-2-margin*2, rectrotate.height-4-margin*2);
		theCanvas.context.rect(rectleft.x+margin,rectleft.y+margin,rectleft.width-2-margin*2, rectleft.height-4-margin*2);
		theCanvas.context.rect(rectright.x+margin,rectright.y+margin,rectright.width-2-margin*2, rectright.height-4-margin*2);
		theCanvas.context.rect(rectdown.x+margin,rectdown.y+margin,rectdown.width-2-margin*2, rectdown.height-4-margin*2);
		theCanvas.context.rect(rectfullscreen.x+margin,rectfullscreen.y+margin,rectfullscreen.width-2-margin*2, rectfullscreen.height-4-margin*2);
		
		

		
		
		theCanvas.context.strokeStyle = 'rgba(255,255,255,0.3)';
		theCanvas.context.fillStyle = "rgba(255, 255, 255, 0.2)";
		theCanvas.context.lineWidth = 1;
		theCanvas.context.fill();
		theCanvas.context.stroke();
		
		theCanvas.context.font='20px fontawesome';
		
		theCanvas.context.fillStyle = 'rgba(255,255,255,1)';
		theCanvas.context.textAlign = "center";
		theCanvas.context.fillText('\uf31e',1+rectfullscreen.x -margin/2 + rectfullscreen.width/2,rectfullscreen.y+margin +26);
		theCanvas.context.fillText("\uf0e2",1+rectrotate.x -margin/2 + rectrotate.width/2 ,rectrotate.y+margin +26);
		theCanvas.context.fillText("\uF063",1+rectdown.x -margin/2 + rectdown.width/2 ,rectdown.y+margin +26);
		theCanvas.context.fillText('\uF061',1+rectright.x -margin/2 + rectright.width/2 ,rectright.y+margin +26);
		theCanvas.context.fillText('\uF060',1+rectleft.x -margin/2  + rectleft.width/2 ,rectleft.y+margin +26);
		
		theCanvas.context.font='12px Helvetica';
		
		theCanvas.context.fillText("LEVEL", 1+ rectlevel.x  + rectlevel.width/2 ,rectlevel.y+margin +28);

		theCanvas.context.font='25px Helvetica';
		theCanvas.context.fillText((this.level + 1).toString(),rectlevel.x  + rectlevel.width/2 ,rectlevel.y+margin +53);

		theCanvas.context.closePath();
		
		
		if (this.live!=null){
			this.live.draw();
		}
		
		
		if (this.nextobj!=null){
			this.nextobj.draw();
		}
		
		for (var i=this.soldedblocks.length-1; i>=0; i--) {
			this.soldedblocks[i].draw();
		}
	}
	
	

	this.solderAndRelease = function(liveobj) {
		if (liveobj) {
			for (var i=liveobj.blocks.length-1; i>=0; i--) {
				this.soldedblocks.push(liveobj.blocks[i]);
			}
			
			if (this.live == liveobj)
			{
				this.live=null;
			}
			this.soldedblocks.sort(function(a,b) {
				return (a.hash() - b.hash()); 
			});
			this.checkDies();
		}
	}
	
	this.diedRows = new Array();
	this.checkDies = function() {
		var sb = this.soldedblocks;
		this.diedRows = new Array();
		for (var i=sb.length-1; i>=this.gridWidth-1; i--) {
			if (sb[i].position.y==sb[i-(this.gridWidth-1)].position.y){
				this.diedRows.push(sb[i].position.y);					
				this.dieing = true;
				this.stepAmount=0;				
				for (var iDie=i; iDie>=i-(this.gridWidth-1); iDie--) {
					sb[iDie].status = 1;				
				}
			}			
		}
	}
	
	this.isEmpty = function(x,y) {
		for (var i=this.soldedblocks.length-1; i>=0; i--) {
			if ((this.soldedblocks[i].position.x == x) && (this.soldedblocks[i].position.y == y))
			{
				return false;
			}
		}
		
		return true;
	}
	
	
}


function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

function liveObject(grid, objectDefinition) {
	this.grid = grid;
	this.pairX = objectDefinition[1]%2==0;
	this.pairY = ((objectDefinition.length - 2) / objectDefinition[1])%2 == 0;
	this.position = {
				x:Math.ceil(grid.gridWidth/2), 
				y:0
	};	

	this.blocks = new Array();
	
	this.addBlock = function(relX,relY, txtcolor) {
		var r,g,b;
		r= hexToR(txtcolor);
		g= hexToG(txtcolor);
		b= hexToB(txtcolor);
		
		var aBlock = new JBlock(this.grid, r,g,b);
		aBlock.relposition = {x: relX, y:relY };
		this.blocks.push(aBlock);
	}
	
	this.updateBlockPos =function() {
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			var relX = aBlock.relposition.x;
			var relY = aBlock.relposition.y;
			
			if (this.pairX) {
				if (relX >= 0)
					relX--;
			/*}
			
			if (this.pairY) {*/
				if (relY >= 0)
					relY--;
			}
			
				
			aBlock.position =
			{
				x: this.position.x + relX,
				y: this.position.y + relY
			};
		}
	}
	
	
	this.width = objectDefinition[1];
	this.height = 0;
	for(var iY=0; (iY*objectDefinition[1]) + 2 < objectDefinition.length ; iY++) {
		this.height++;
		for(var iX=0; iX<objectDefinition[1]; iX++) {
			if (objectDefinition[2+iY*objectDefinition[1]+iX] == 1) {
				var relX = (iX-(objectDefinition[1]-1)/2);
				var relY = (iY-(objectDefinition[1]-1)/2);
				
				if (this.pairX)
				{
					relX = iX-((objectDefinition[1])/2);
					if (relX >= 0)
						relX++;
			
					relY = iY-((objectDefinition[1])/2);
					if (relY >= 0)
						relY++;
				}
				
				this.addBlock(relX, relY, objectDefinition[0]);
			}
		}
	}
	
	this.updateBlockPos();
	
	this.update = function(msTime) {
		this.updateBlockPos();	
	}
	
	this.stepDown = function() {
		if (this.canStepDown()) {
			this.position.y++;
			this.updateBlockPos();
		}
		else {
			this.fuse();
		}
	}
	
	this.fuse = function() {
		this.grid.solderAndRelease(this);
	}
	
	this.rotate90cw = function() {
		//(x, y) rotated 90 degrees = (y, -x)
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			aBlock.relposition = {
				x: - aBlock.relposition.y,
				y: + aBlock.relposition.x
			}
		}
		
		this.updateBlockPos();
			
		if (!this.validate()){
	
			for (var i=this.blocks.length-1; i>=0; i--) {
				var aBlock = this.blocks[i];
				aBlock.relposition = {
					x:  aBlock.relposition.y,
					y: - aBlock.relposition.x
				}
			}
			this.updateBlockPos();
		}
		
	}
	
	this.rotate90acw = function() {
		//(x, y) rotated 90 degrees = (y, -x)
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			aBlock.relposition = {
				x: + aBlock.relposition.y,
				y: - aBlock.relposition.x
			}
		}
		
		this.updateBlockPos();
			
		if (!this.validate()){
	
			for (var i=this.blocks.length-1; i>=0; i--) {
				var aBlock = this.blocks[i];
				aBlock.relposition = {
					x: - aBlock.relposition.y,
					y: + aBlock.relposition.x
				}
			}
			this.updateBlockPos();
		}
		
	}
	
	this.validate = function() {
		var can = true;
		
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			can = (can && (aBlock.position.y )  < this.grid.gridHeight)
					&& ((aBlock.position.x)  < this.grid.gridWidth)
					&& (aBlock.position.x >= 0)
					&& (aBlock.position.y >= 0)
					&& this.grid.isEmpty(aBlock.position.x,aBlock.position.y);
		}
		
		return can
	}
	
	this.stepLeft = function() {
		if (this.canStepLeft()) { 
			this.position.x--;
			this.updateBlockPos();
		}
	}
	
	
	this.stepRight= function() {
		if (this.canStepRight()) { 
			this.position.x++;
			this.updateBlockPos();
		}
	}
	
	this.draw = function() {
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			aBlock.draw();
		}
	}


	this.canStepDown = function() {
		var can = true;
		
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			can = can && (aBlock.position.y + 1)  < this.grid.gridHeight;
			can = can && this.grid.isEmpty(aBlock.position.x, aBlock.position.y+1);
		}
		
		
		return can;
	}
	
	
	this.canStepLeft = function() {
		var can = true;
		
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			can = can && (aBlock.position.x > 0) && this.grid.isEmpty(aBlock.position.x-1,aBlock.position.y);
		}
		
		
		
		return can;
	}	

	this.canStepRight = function() {
		var can = true;
		
		for (var i=this.blocks.length-1; i>=0; i--) {
			var aBlock = this.blocks[i];
			can = can && ((aBlock.position.x + 1)  < this.grid.gridWidth) && this.grid.isEmpty(aBlock.position.x+1,aBlock.position.y);
		}
		
		return can;
	}	
}


function JBlock(grid, r,g,b) {
	var R = r, G = g, B = b;
	var color = rgbToHex(r,g,b);
	var deadcolor = rgbToHex((r+g+b)/3,(r+g+b)/3,(r+g+b)/3);
	var deadcolorborder = rgbToHex((r+g+b)/3 -10,(r+g+b)/3 -10,(r+g+b)/3 -10);
	
	var colorborder =  "rgba(255,255,255,0.1)";

	this.stroke = colorborder;
	this.fill = '#' + color.toString(16);
	this.grid = grid;
	this.status = 0;
	
	this.hash = function() {
		return this.position.y * this.grid.gridWidth + this.position.x;
	}
	
	
	this.position = {
		x: 0,
		y: 0
	};
	
	this.draw = function() {
		if (this.position.y >= 0) {
			if (this.grid.status == 2) {
				this.stroke = '#'+deadcolorborder.toString(16);
				this.fill = '#'+deadcolor.toString(16);
			}
		
			var margin = 0;
			if (this.status == 1) {
 				var g = this.grid;				
				margin = (g.rectSize * g.stepAmount / g.dieingSpeed) /2;			
			}	
			theCanvas.context.beginPath();
			theCanvas.context.rect(
					margin + this.grid.position.x + this.position.x* this.grid.rectSize,
					margin + this.grid.position.y + this.position.y* this.grid.rectSize,
					this.grid.rectSize-1 - margin * 2,
					this.grid.rectSize-1 - margin * 2);
			theCanvas.context.strokeStyle = this.stroke;
			theCanvas.context.fillStyle = this.fill;
			
			theCanvas.context.lineWidth = 0;
			theCanvas.context.fill();
			theCanvas.context.lineWidth = 1;
			theCanvas.context.stroke();
			//theCanvas.context.fill();
			theCanvas.context.closePath();
		}
	}

}
