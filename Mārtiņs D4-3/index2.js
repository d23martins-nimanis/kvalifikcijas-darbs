/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");

const FPS = 60;
        const FRICTION = 1;
        const TRIANGLE_SIZE = 30; // triangle highgt
        const TRIANGLE_ACCEL = 5; // acceleration
        const TURN_SPEED = 360;


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
                case 37: // stop left
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
		}
