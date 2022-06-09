/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const FPS = 60;
const FRICTION = 1;
const TRIANGLE_SIZE = 30; // triangle highgt
const TRIANGLE_ACCEL = 5; // acceleration
const TURN_SPEED = 360;
const FONT_SIZE = 60;
const STARTING_LIFES = 5;
//temporay:
const CIRKLE_SIZE = 20;
const CIRKLE_SPD = 30;
const DIFF = 10;
const DIFF_STEP = 1
const SQUARE_SIZE = CIRKLE_SIZE;
const SQUARE_SPD = CIRKLE_SPD;

var cirkles , score, scoreHigh, triangle, text, textAlpha, bounce, as, squaresLeft, cirklesLeft, boun, lifes;

var lifes = STARTING_LIFES;

        // set up triangle/player
        var triangle = {
            x: canv.width / 2,
            y: canv.height / 2,
            r: TRIANGLE_SIZE / 2,
            a: 90 / 180 * Math.PI,
            rot: 0,
            accelerating: false,
            accel: {
                x: 0,
                y: 0
            }
        }

        //event handlers
        document.addEventListener("keydown", Down);
        document.addEventListener("keyup", Up);
				var boun = 0

        //game loop
        setInterval(update, 1000 / FPS);

        function Down(/** @type {KeyboardEvent} */ ev) {
            switch(ev.keyCode) {
                case 37: // rotating left
                    triangle.rot = TURN_SPEED / 180 * Math.PI / FPS;
                    break;
                case 38: // accelerate
                    triangle.accelerating = true;
                    break;
                case 39: // rotating right
                    triangle.rot = -TURN_SPEED / 180 * Math.PI / FPS;
                    break;
            }
        }

        function Up(/** @type {KeyboardEvent} */ ev) {
            switch(ev.keyCode) {
                case 37: // stop rotating left
                    triangle.rot = 0;
                    break;
                case 38: // stop accelerating
                    triangle.accelerating = false;
                    break;
                case 39: // stop rotating right
                    triangle.rot = 0;
                    break;
            }
        }

				function spawnCirkle() {
        	  cirkles = [];
          	for (var i = 0; i < score + DIFF /2; i++) {
            	  do {
             	     x = Math.floor(Math.random() * canv.width);
             	     y = Math.floor(Math.random() * canv.height);
          	    } while (distBetweenPoints(triangle.x, triangle.y, x, y) < CIRKLE_SIZE * 2 + triangle.r);
    	         	cirkles.push(newCirkle(x, y, Math.ceil(CIRKLE_SIZE / 2)));
						}
				}

				function spawnSquare() {
        	  squares = [];
          	for (var i = 0; i < score + DIFF / 2; i++) {
            	  do {
             	     x = Math.floor(Math.random() * canv.width);
             	     y = Math.floor(Math.random() * canv.height);
          	    } while (distBetweenPoints(triangle.x, triangle.y, x, y) < SQUARE_SIZE * 2 + triangle.r);
    	         	squares.push(newSquare(x, y, Math.ceil(SQUARE_SIZE / 2)));
						}
				}

				function destroyCirkle(index) {
						score += 1;
            //if (score > scoreHigh) {
            //    scoreHigh = score;
            //    localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
            //}
            //cirkles.splice(index, 1);
				}

				function distBetweenPoints(x1, y1, x2, y2) {
        	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
				}

				function newCirkle(x, y, r) {
    				var diffMult = 1 + 0.1 * DIFF;
						console.log(cirkles.length);
    				var cirkle = {
    						x: x,
        				y: y,
			     	    xv: Math.random() * CIRKLE_SPD * diffMult / FPS * (Math.random() < 0.5 ? 1 : -1),
			      	  yv: Math.random() * CIRKLE_SPD * diffMult / FPS * (Math.random() < 0.5 ? 1 : -1),
			      	  a: Math.random() * Math.PI * 2, // in radians
			      	  r: r,
    				};
    				return cirkle;
				}

				function newSquare(x, y, r) {
    				var diffMult = 1 + 0.1 * DIFF;
    				var square = {
    						x: x,
        				y: y,
			     	    xv: Math.random() * SQUARE_SPD * diffMult / FPS * (Math.random() < 0.5 ? 1 : -1),
			      	  yv: Math.random() * SQUARE_SPD * diffMult / FPS * (Math.random() < 0.5 ? 1 : -1),
			      	  a: Math.random() * Math.PI * 2, // in radians
			      	  r: r,
    				};
    				return square;
				}

				function hit(){
					lifes -= 1;
				}

				function bounce(x, y){
					var sx, sy;
					sx = x;
					sy = y;
					boun = 10;
					console.log('bounce');

					if (Math.abs(triangle.x - sx)> 10) {
							triangle.accel.x = -triangle.accel.x * 1.2;
					} else if (Math.abs(triangle.xy- sy)> 10) {
							triangle.accel.y = -triangle.accel.y * 1.2;
					} else {
							triangle.accel.x = -triangle.accel.x * 1.2;
							triangle.accel.y = -triangle.accel.y * 1.2;
					}
				}

start();

function start(){
	score = 0;
	spawnCirkle();
	spawnSquare();
}

        function update() {
            // bacground
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canv.width, canv.height);

						if (boun > 1){
							boun -= 1;
						}
					
						//zīmē punktus
						ctx.textAlign = "right"
						ctx.textBaseline = "middle"
						ctx.fillStyle = "white"
						ctx.font = FONT_SIZE + "Kdam Thmor Pro";
						ctx.fillText("LIFES = " + lifes, TRIANGLE_SIZE * 2.5, TRIANGLE_SIZE);
						ctx.fillText(score, canv.width - TRIANGLE_SIZE, TRIANGLE_SIZE);
					
            // acceleration
            if (triangle.accelerating) {
                triangle.accel.x += TRIANGLE_ACCEL * Math.cos(triangle.a) / FPS;
                triangle.accel.y -= TRIANGLE_ACCEL * Math.sin(triangle.a) / FPS;
								//console.clear()
								//console.log(Math.sin(triangle.a) / FPS);

						//friction
            } else {
                triangle.accel.x -= FRICTION * triangle.accel.x / FPS;
                triangle.accel.y -= FRICTION * triangle.accel.y / FPS;
            }
					
            // draw the triangle
						ctx.strokeStyle = 'white';
            ctx.lineWidth = TRIANGLE_SIZE / 20;
            ctx.beginPath();
            ctx.moveTo(
                triangle.x + 2 * triangle.r * Math.cos(triangle.a),
                triangle.y - 2 * triangle.r * Math.sin(triangle.a)
            );
            ctx.lineTo(
                triangle.x - triangle.r * (2 / 3 * Math.cos(triangle.a) + Math.sin(triangle.a)),
                triangle.y + triangle.r * (2 / 3 * Math.sin(triangle.a) - Math.cos(triangle.a))
            );
            ctx.lineTo(
                triangle.x - triangle.r * (2 / 3 * Math.cos(triangle.a) - Math.sin(triangle.a)),
                triangle.y + triangle.r * (2 / 3 * Math.sin(triangle.a) + Math.cos(triangle.a))
            );
            ctx.closePath();
						ctx.stroke();

            // triangle's movement
            triangle.a += triangle.rot;
            triangle.x += triangle.accel.x;
            triangle.y += triangle.accel.y;

            // makes the triangle go from one edge to the oposite
            if (triangle.x < 0 - triangle.r) {
                triangle.x = canv.width + triangle.r;
            } else if (triangle.x > canv.width + triangle.r) {
                triangle.x = 0 - triangle.r;
            }
            if (triangle.y < 0 - triangle.r) {
                triangle.y = canv.height + triangle.r;
            } else if (triangle.y > canv.height + triangle.r) {
                triangle.y = 0 - triangle.r;
            }

						// draw the cirkle
            var a, r, x, y;
            for (var i = 0; i < cirkles.length; i++) {
                ctx.strokeStyle = "slategrey";
                ctx.lineWidth = TRIANGLE_SIZE / 20;

                // get the cirkle properties
                a = cirkles[i].a;
                r = cirkles[i].r;
                x = cirkles[i].x;
                y = cirkles[i].y;

								ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2, false);
                ctx.stroke();
						}
					
						//move cirkle
						for (var i = 0; i < cirkles.length; i++) {
                cirkles[i].x += cirkles[i].xv;
                cirkles[i].y += cirkles[i].yv;

                // handle cirkle edge of screen
                if (cirkles[i].x < 0 - cirkles[i].r) {
                    cirkles[i].x = canv.width + cirkles[i].r;
                } else if (cirkles[i].x > canv.width + cirkles[i].r) {
                    cirkles[i].x = 0 - cirkles[i].r
                }
                if (cirkles[i].y < 0 - cirkles[i].r) {
                    cirkles[i].y = canv.height + cirkles[i].r;
                } else if (cirkles[i].y > canv.height + cirkles[i].r) {
                    cirkles[i].y = 0 - cirkles[i].r
                }
						}

						//papildina riņķus
						if (cirkles.length < score + DIFF){
								console.log("lol cirkle");
										do {
             	     			x = Math.floor(Math.random() * canv.width);
             	     			y = Math.floor(Math.random() * canv.height);
          	    		} while (distBetweenPoints(triangle.x, triangle.y, x, y) < CIRKLE_SIZE * 2 + triangle.r);
    	         			cirkles.push(newCirkle(x, y, Math.ceil(CIRKLE_SIZE / 2)));
						}

						//papildina kvadrātus
						if (squares.length < score + DIFF){
								console.log("lol square");
										do {
												x = Math.floor(Math.random() * canv.width);
             	    			y = Math.floor(Math.random() * canv.height);
          	    		} while (distBetweenPoints(triangle.x, triangle.y, x, y) < SQUARE_SIZE * 2 + triangle.r);
    	         			squares.push(newSquare(x, y, Math.ceil(SQUARE_SIZE / 2)));
						}

					
						//ja noķer riņķi
						for (var i = 0; i < cirkles.length; i++) {
    						if (distBetweenPoints(triangle .x, triangle .y, cirkles[i].x, cirkles[i].y) < triangle .r + cirkles[i].r) {
        				destroyCirkle(i);
								cirkles.splice(i, 1);
								console.log(cirkles.length);									
        				break;
								}
						}
						
						//draw squares
            var a, r, x, y;
            for (var i = 0; i < squares.length; i++) {
                ctx.strokeStyle = "slategrey";
                ctx.lineWidth = TRIANGLE_SIZE / 20;

                a = squares[i].a;
                r = squares[i].r;
                x = squares[i].x;
                y = squares[i].y;

								ctx.beginPath();
                ctx.strokeRect(x - TRIANGLE_SIZE/2, y - TRIANGLE_SIZE/2, TRIANGLE_SIZE, TRIANGLE_SIZE)
								ctx.strokeStyle = "red";
                ctx.lineWidth = TRIANGLE_SIZE / 40;		
							
								ctx.beginPath();
                ctx.arc(x, y, r/1.5, 0, Math.PI * 2, false);
                ctx.stroke();
						}
					
            // move square
						for (var i = 0; i < squares.length; i++) {
                squares[i].x += squares[i].xv;
                squares[i].y += squares[i].yv;
									
                // handle square edge of screen
                if (squares[i].x < 0 - squares[i].r) {
                    squares[i].x = canv.width + squares[i].r;
                } else if (squares[i].x > canv.width + squares[i].r) {
                    squares[i].x = 0 - squares[i].r
                }
                if (squares[i].y < 0 - squares[i].r) {
                    squares[i].y = canv.height + squares[i].r;
                } else if (squares[i].y > canv.height + squares[i].r) {
                    squares[i].y = 0 - squares[i].r
                }
						}
						
						for (var i = 0; i < squares.length; i++) {
    						if (distBetweenPoints(triangle .x, triangle .y, squares[i].x, squares[i].y) < triangle .r + squares[i].r) {

								if (boun <= 1){
									bounce(squares[i].x, squares[i]);
									squares.splice(i, 1);
        					hit();
								}
        				break;
								}
						}
				}

