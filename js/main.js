//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'radio6';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}.glb`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.scale.set(13, 13, 13);
    scene.add(object);
    object.rotation.y = -Math.PI/2;
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = 500;

const topLight = new THREE.DirectionalLight(0xffb6c1, 1); // Increased intensity
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffb6c1, 2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffb6c1, 25);
    pointLight.position.set(10, 100, 10000);
    scene.add(pointLight);



// Mouse variables
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

// Add mouse event listeners
document.addEventListener('mousedown', function(e) {
    isDragging = true;
    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
});

document.addEventListener('mousemove', function(e) {
    if(isDragging) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        object.rotation.y += deltaMove.x * 0.005;
        object.rotation.x += deltaMove.y * 0.005;

        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    }
});

document.addEventListener('mouseup', function(e) {
    isDragging = false;

    // Animate return to original position
    gsap.to(object.rotation, {
        y: -Math.PI / 2,
        x: 0,
        duration: 1
    });
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});