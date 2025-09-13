// Global variables
// height and width of the browser window
var ww = window.innerWidth;
var wh = window.innerHeight;
var counter = 0;
var frame = 0;
var n = 4;
var spheres = [];
var directions = [];
var speeds = [];

/* Feb 4: Homework:
1. Add another a point light into your scene
	 https://threejs.org/docs/#api/en/lights/PointLight
2. Please animate your point light :
	rotate it around the cube
*/

function init() {
  /*Initilization function
    Calls render, camera, light, makeBox, and makes scene
  */

  // Make a renderer
  createRenderer();
  // Make a camera
  createCamera();
  // Make a light
  createLight();
  // Build a scene to glue everything together
  // Need to add in the camera, light, and objects
  scene = new THREE.Scene();
  scene.add(camera);
  scene.add(light);



  // get camera to look at origin
  camera.lookAt(scene.position);

  // Create cube
  // Add cube to scene
  createCube();
  scene.add(cube);

  // Create ground
  // Add ground to scene
  createGround();
  scene.add(ground);

  for (let i = 1; i <= n; i++){
  	let sphere = createSphere();
    sphere.position.x = 60 - i * 28;
    sphere.position.y = 10
    sphere.position.z = getRandomInt(-50, 50)
     spheres.push(sphere)
    scene.add(sphere)
    directions.push(true)
    speeds.push(getRandomInt(1, 2))
  }
  // get the renderer to render our scene
  // leave the rendering to last
  renderer.render(scene, camera);

  // animate at the end of the setup
  animate();

  // If the user scrolls up or down
  window.addEventListener("mousewheel", zoom);

  // If the user presses an arrow key
  window.addEventListener("keydown", move);
  window.addEventListener("keydown", movecube);
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) ) + min;
}

function startGame() {
   let startDiv = document.getElementById("start");
   let gameCanvas = document.getElementById("scene");
   let gameOver = document.getElementById("game-over");
   let youWin = document.getElementById("you-win");
   startDiv.style.display = "none";
   gameCanvas.style.display = "block";
   gameOver.style.display = "none";
   youWin.style.display = "none";
   init();
}

function gameOver() {
   let startDiv = document.getElementById("start");
   let gameCanvas = document.getElementById("scene");
   let gameOver = document.getElementById("game-over");
   let youWin = document.getElementById("you-win");
   startDiv.style.display = "none";
   gameCanvas.style.display = "none";
   gameOver.style.display = "block";
   youWin.style.display = "none";
}

function youWin(){
	 let startDiv = document.getElementById("start");
   let gameCanvas = document.getElementById("scene");
   let gameOver = document.getElementById("game-over");
   let youWin = document.getElementById("you-win");
   startDiv.style.display = "none";
   gameCanvas.style.display = "none";
   gameOver.style.display = "none";
   youWin.style.display = "block";
}
function createRenderer() {
  /* Creates the renderer*/
  // Call rendering engine WebGL
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene")
  });

  // set the background colour of our scene
  renderer.setClearColor(0x1C2833);

  // render the full screen
  renderer.setSize(ww, wh);

   // Activate shadow rendering
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

}

function createCamera() {
	/* Creates the camera*/
  camera = new THREE.PerspectiveCamera(50, ww/wh, 1, 10000);

  // set position of camera
  // x = 0, y = 0, z = 500
  camera.position.set(100, 100, 100);

}

function createLight() {
  /* Creates the light*/

  // colour = white, intensity = 1
  // Directional light is like the sun at a direction
  light = new THREE.SpotLight(0xfef9e7, 1);

  // We the position of our light
  // x = 50, y = 250, z = 500
  light.position.set(10, 80, 0);

  light.castShadow = true;
}

function createCube() {
	/* Creates the cube*/

  // 1. geometry
  // wdith = 200, hiegh = 200, length = 200
  geometry = new THREE.BoxGeometry(10, 10, 10);

  // 2. texture
  texture = new THREE.MeshLambertMaterial(
  	{color: 0x00ff00}
  );

  // 3. Mesh
  // give it a geometry and texture
  cube = new THREE.Mesh(geometry, texture);

  // Rotate it a bit to see more of the cube
  // Angle is in units of radians

   // Add some position
  cube.position.set(71, 10, 0);

  cube.castShadow = true;
  cube.receiveShadow = true;

}

function createSphere() {
	/* Creates the cube*/

  // 1. geometry
  // wdith = 200, hiegh = 200, length = 200
  let geometry = new THREE.SphereGeometry(5, 32, 16);

  // 2. texture
  let texture = new THREE.MeshLambertMaterial(
  	{color: 0x00ff00}
  );

  // 3. Mesh
  // give it a geometry and texture
  let sphere = new THREE.Mesh(geometry, texture);

  // Rotate it a bit to see more of the cube
  // Angle is in units of radians

   // Add some position

  sphere.castShadow = true;
  sphere.receiveShadow = true;

  return sphere;
}

function createGround() {
  ground = new THREE.Mesh(
    new THREE.BoxGeometry(150, 1, 150),
    new THREE.MeshLambertMaterial({
      color: 0x979A9A,
      //	opacity: 0.3,
      //	transparent: true
    }));
  ground.position.set( 0, 0, 0 );
  ground.receiveShadow = true;
}

var animate = function () {
	// Request another frame of the animation
  // call itself
  requestAnimationFrame(animate);
  counter += 0.05

  for (let i = 0; i < n; i++){
  	if (spheres[i].position.z >= 45){
			directions[i] = false;
    } else if (spheres[i].position.z <= -45){
    	directions[i] = true;
    }
    if (directions[i] == true){
    	spheres[i].position.z += speeds[i];
    } else{
    	spheres[i].position.z -= speeds[i];
    }
    if ((Math.abs(spheres[i].position.z - cube.position.z) < 8) && (Math.abs(spheres[i].position.x - cube.position.x) < 8)){
    	gameOver();
    }
    if (cube.position.x < -35){
    	youWin();
    }
  }

  //Re-render everytime we make change
  renderer.render(scene, camera);
}

var zoom = function (e){
	//Move our camera up or down
	camera.position.z += e.deltaY;
}

var move = function (e){
	// Figure out which ints the 4 arrow correspond to

  let key_int = e.which;

  if (key_int == 37) {
  	camera.position.x += 50;
  } else if (key_int == 39) {
  	camera.position.x -= 50;
  } else if (key_int == 38) {
  	camera.position.y -= 50;
  } else if (key_int == 40) {
  	camera.position.y += 50;
  }


}

var movecube = function (e) {
	let key_int = e.which;
	if (key_int == 65 && cube.position.x > -40) {
  	cube.position.x -= 5;
  } else if (key_int == 87 && cube.position.z > -45){
  	cube.position.z -= 5;
  } else if (key_int == 68 && cube.position.x < 50){
  	cube.position.x += 5;
  } else if (key_int == 83 && cube.position.z < 50){
  	cube.position.z += 5;
  }
}


/* Finished writing functions */
//Initialize our scene -- run at the end
