(function(){
	if (matchMedia("(prefers-reduced-motion: reduce)").matches)
		return;
	
	let fps = 30;
	let sprite = "mr-saturn.png";
	let spriteWidth = 16;
	let spriteHeight = 21;
	let element = document.createElement("div");
	let speed = 60;
	let x = 16;
	let y = 16;
	let targetX = 0;
	let targetY = 0;
	
	function init() {
		//#region Set FPS
		
		const fpsAttrib = document.currentScript.getAttribute("fps");
		
		if (fpsAttrib) {
			const number = parseFloat(fpsAttrib);
			if (!isNaN(number)) {
				fps = number;
			}
		}
		
		//#endregion
		
		//#region Set initial position
		
		const xAttrib = document.currentScript.getAttribute("x");
		const yAttrib = document.currentScript.getAttribute("y");
		
		if (xAttrib) {
			if (xAttrib.toLowerCase() === "center") {
				x = window.innerWidth / 2 - spriteWidth / 2;
			} else {
				const number = parseFloat(xAttrib);
				if (!isNaN(number)) {
					x = number;
				}
			}
		}
		
		if (yAttrib) {
			if (yAttrib.toLowerCase() === "center") {
				y = window.innerHeight / 2 - spriteHeight / 2;
			} else {
				const number = parseFloat(yAttrib);
				if (!isNaN(number)) {
					y = number;
				}
			}
		}
		
		targetX = x;
		targetY = y;
		
		//#endregion
		
		//#region Setup html element
		
		element.id = "mr-saturn";
		
		const style = element.style;
		style.width = `${spriteWidth}px`;
		style.height = `${spriteHeight}px`;
		style.position = "absolute";
		style.left = `${x}px`;
		style.top = `${y}px`;
		style.imageRendering = "pixelated";
		style.background = `url("${sprite}")`;
		style.backgroundPositionX = "0px";
		style.backgroundPositionY = "0px";
		style.pointerEvents = "none";
		
		document.body.appendChild(element);
		
		//#endregion
		
		//#region Events
		
		document.addEventListener("mousedown", event => {
			const maxDistance = Math.random() * 16;
			const x = event.pageX + Math.sin(Math.random() * Math.PI * 2) * maxDistance - spriteWidth / 2;
			const y = event.pageY + Math.cos(Math.random() * Math.PI * 2) * maxDistance - spriteHeight / 2;
			setTarget(x, y);
		});
		
		requestAnimationFrame(loop);
		
		//#endregion
	}
	
	function update(delta) {
		if (x !== targetX || y !== targetY) {
			const directionX = Math.sign(targetX - x);
			const directionY = Math.sign(targetY - y);
			const angle = (Math.atan2(directionX, directionY) * 180 / Math.PI + 360) % 360;
			
			if (directionX > 0) {
				x = Math.min(x + speed * delta, targetX);
			} else if (directionX < 0) {
				x = Math.max(x - speed * delta, targetX);
			}
			
			if (directionY > 0) {
				y = Math.min(y + speed * delta, targetY);
			} else if (directionY < 0) {
				y = Math.max(y - speed * delta, targetY);
			}
			
			element.style.backgroundPositionY = `${-Math.round(angle / 45) * spriteHeight}px`;
			animate(0.15, delta);
		} else {
			wander(delta);
			animate(0.4, delta);
		}
	}
	
	let randomTargetTimer = 1 + Math.random() * 9;
	
	function wander(delta) {
		randomTargetTimer -= delta;
		
		if (randomTargetTimer <= 0) {
			randomTargetTimer = 1 + Math.random() * 9;
			setTarget(
				x + -64 + Math.random() * 128,
				y + -64 + Math.random() * 128
			);
		}
	}
	
	function setTarget(x, y) {
		const leftLimit = 8,
			topLimit = 8,
			rightLimit = window.innerWidth - spriteWidth - 8,
			bottomLimit = window.innerHeight - spriteHeight - 8;
		
		targetX = x;
		targetY = y;
		
		targetX = Math.min(Math.max(leftLimit, targetX), rightLimit);
		targetY = Math.min(Math.max(topLimit, targetY), bottomLimit);
	}
	
	let animationTimer = 0;
	
	function animate(frameDuration, delta) {
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
		
		if (animationTimer > frameDuration) {
			if (element.style.backgroundPositionX === "0px") {
				element.style.backgroundPositionX = "16px";
			} else {
				element.style.backgroundPositionX = "0px";
			}
			animationTimer = 0;
		}
		animationTimer += delta;
	}
	
	let lastTimestamp = 0;
	
	function loop(timestamp) {
		const elapsed = timestamp - lastTimestamp;
		
		if (elapsed > 1000 / fps) {
			lastTimestamp = timestamp;
			update(elapsed / 1000);
		}
		
		requestAnimationFrame(loop);
	}
	
	init();
})();
