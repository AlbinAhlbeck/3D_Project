import * as THREE from 'three';

var { imageNames, currentPageIndex, textureLoader, scene, camera, renderer } = setupScene();

AddListeners();

let isDragging = false;
let previousMouseX = 0;


CreatePages();
CreateDescriptionText();


function setupScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const imageNames = ['https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=400',
     'https://images.pexels.com/photos/2647714/pexels-photo-2647714.jpeg?auto=compress&cs=tinysrgb&w=400',
     'https://images.pexels.com/photos/905198/pexels-photo-905198.jpeg?auto=compress&cs=tinysrgb&w=400',
     'https://images.pexels.com/photos/3049121/pexels-photo-3049121.jpeg?auto=compress&cs=tinysrgb&w=400',
     'https://images.pexels.com/photos/3356416/pexels-photo-3356416.jpeg?auto=compress&cs=tinysrgb&w=400',
     'https://images.pexels.com/photos/2263510/pexels-photo-2263510.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];

    const textureLoader = new THREE.TextureLoader();
    let currentPageIndex = 0;

    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    return { imageNames, currentPageIndex, textureLoader, scene, camera, renderer };
}

function AddListeners() {
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('wheel', onWheel);
    document.addEventListener('keydown', onKeyDown);
}

function CreatePages() {
    const leftImage = imageNames[currentPageIndex];
    const rightImage = imageNames[currentPageIndex + 1];
    CreatePage(leftImage, rightImage);
}

function CreatePage(leftImage, rightImage) {
    const pageGeometry = new THREE.PlaneGeometry(2.8, 3.8);
    const textureLeft = textureLoader.load(`${leftImage}`);
    const pageMaterialLeft = new THREE.MeshBasicMaterial({ map: textureLeft, side: THREE.DoubleSide });
    const leftPage = new THREE.Mesh(pageGeometry, pageMaterialLeft);
    leftPage.position.set(-1.25, 0, 0);
    leftPage.rotateY(0.5);
    scene.add(leftPage);

    const textureRight = textureLoader.load(`${rightImage}`);
    const pageMaterialRight = new THREE.MeshBasicMaterial({ map: textureRight, side: THREE.DoubleSide });
    const rightPage = new THREE.Mesh(pageGeometry, pageMaterialRight);
    rightPage.position.set(1.25, 0, 0);
    rightPage.rotateY(-0.5);
    scene.add(rightPage);
}

function onMouseDown(event) {
    isDragging = true;
    previousMouseX = event.clientX;
}

function onMouseUp() {
    isDragging = false;
}

function onMouseMove(event) {
    if (isDragging) {
        const delta = event.clientX - previousMouseX;
        const rotationDelta = delta * 0.01;
        const currentRotationY = scene.rotation.y;
        const newRotationY = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, currentRotationY + rotationDelta));
        scene.rotation.y = newRotationY;
        previousMouseX = event.clientX;
    }
}

function onWheel(event) {
    const delta = event.deltaY * 0.01;
    const newCameraZ = camera.position.z + delta;
    if (newCameraZ > 2 && newCameraZ < 20) {
        camera.position.z = newCameraZ;
    }
}

function onKeyDown(event) {
    if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
        // Previous page
        if (currentPageIndex > 0) {
            currentPageIndex -= 2;
        } else {
            // Loop back to the last pair of images
            currentPageIndex = imageNames.length - 2;
        }
        resetScene();
    } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
        // Next page
        if (currentPageIndex < imageNames.length - 2) {
            currentPageIndex += 2;
        } else {
            // Loop back to the beginning
            currentPageIndex = 0;
        }
        resetScene();
    }
}

function CreateDescriptionText() {
    const descriptionDiv = document.createElement('div');

    descriptionDiv.innerHTML = "Use A/D or ←/→ keys to navigate";
    descriptionDiv.style.position = 'absolute';
    descriptionDiv.style.bottom = '10px';
    descriptionDiv.style.left = '10px';
    descriptionDiv.style.color = 'white';

    document.body.appendChild(descriptionDiv);
}

function resetScene() {
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            scene.remove(child);
        }
    });
    CreatePages();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
