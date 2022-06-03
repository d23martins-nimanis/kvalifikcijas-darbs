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
//temporay:
const CIRKLE_SIZE = 20;
const CIRKLE_SPD = 30;
const diff = 10;
const DIFF_STEP = 1

var cirkles , score, scoreHigh, triangle, text, textAlpha;

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

				spawnCirkle();

				function spawnCirkle() {
        	  cirkles = [];
          	for (var i = 0; i < DIFF_STEP + diff; i++) {
            	  do {
             	     x = Math.floor(Math.random() * canv.width);
             	     y = Math.floor(Math.random() * canv.height);
          	    } while (distBetweenPoints(triangle.x, triangle.y, x, y) < CIRKLE_SIZE * 2 + triangle.r);
    	         	cirkles.push(newCirkle(x, y, Math.ceil(CIRKLE_SIZE / 2)));
						}
				}

				function destroyCirkle(index) {
						//score += 1;
						// check high score
            //if (score > scoreHigh) {
            //    scoreHigh = score;
            //    localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
            //}
            // destroy cirkle
            cirkles.splice(index, 1);
				}

				function distBetweenPoints(x1, y1, x2, y2) {
        	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
				}

				function newCirkle(x, y, r) {
    				var diffMult = 1 + 0.1 * diff;
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

        function update() {
            // bacground
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canv.width, canv.height);

            // acceleration
            if (triangle.accelerating) {
                triangle.accel.x += TRIANGLE_ACCEL * Math.cos(triangle.a) / FPS;
                triangle.accel.y -= TRIANGLE_ACCEL * Math.sin(triangle.a) / FPS;

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
						//ctx.fill();

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
						
						for (var i = 0; i < cirkles.length; i++) {
    						if (distBetweenPoints(triangle .x, triangle .y, cirkles[i].x, cirkles[i].y) < triangle .r + cirkles[i].r) {
        				destroyCirkle(i);
        				break;
								}
						}            
}
