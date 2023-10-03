
var container;
var camera, scene, renderer;

var mouseX = 300, mouseY = 300;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();

animate();
var useGyro = false; // Set this to true to enable gyro control


function init() {
    container = document.getElementById( 'canvas' );;
    document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 1000; // Set a different camera position for mobile
    
    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x210600, 0.1);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xaf0404, 3);
    directionalLight.position.set(100, 0, -50);
    scene.add(directionalLight);

    // model

    var loader = new THREE.PRWMLoader();
    var material = new THREE.MeshPhongMaterial({
        side: THREE.FrontSide
    });

    /*
    var material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( "./assets/images/IWP.001.png" )
    });*/


    var busy = false;
    var mesh = null;

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');

            if (xhr.loaded === xhr.total) {
                console.log('File size: ' + (xhr.total / 1024).toFixed(2) + 'kB');
                console.timeEnd('Download');
            }
        }
    };

    var onError = function (xhr) {
        busy = false;
    };

    function loadGeometry(url) {
        if (busy) return;

        busy = true;

        if (mesh !== null) {
            scene.remove(mesh);
            mesh.geometry.dispose();
        }

        console.log('-- Loading', url);
        console.time('Download');
        loader.load(url, function (geometry) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(30, 30, 30);
            scene.add(mesh);

            console.log(geometry.index ? 'indexed geometry' : 'non-indexed geometry');
            console.log('# of vertices: ' + geometry.attributes.position.count);
            console.log('# of polygons: ' + (geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3));
            busy = false;
        }, onProgress, onError);
    }


    //

    renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true});
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    document.querySelectorAll('a.model').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            loadGeometry(anchor.href);
        });
    });

    //

    loadGeometry('/IWP.le.prwm');

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 1;
    mouseY = (event.clientY - windowHalfY) / 1;

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render(event) {

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Add the appropriate event listener based on the device type
if (isMobile) {
  // Mobile device, use gyroscope data
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleGyroscope);

    // You may want to handle orientation changes and remove the event listener when needed
    window.addEventListener('orientationchange', () => {
      window.removeEventListener('deviceorientation', handleGyroscope);
    });
  } else {
    console.log('DeviceOrientationEvent not supported on this mobile device.');
  }
} else {
        console.log('DeviceOrientationEvent not supported on this device.');
        camera.position.x += (-mouseX - camera.position.x-300) * 0.04;
        camera.position.y += (mouseY - camera.position.y+300) * 0.04;
      }
    
    camera.lookAt(scene.position);
    renderer.render(scene, camera);

}
function handleGyroscope(event) {
    if (event) {
      const rotationX = event.alpha || 0; // Alpha represents the device's Z-axis rotation
      const rotationY = event.beta || 0;  // Beta represents the device's X-axis rotation
  
      // Adjust the camera position based on gyroscope data
      camera.position.x += (-rotationX - camera.position.x - 300) * 0.04;
      camera.position.y += (rotationY - camera.position.y + 300) * 0.04;
  
      // You might also want to limit the camera's position to prevent it from going too far
      // For example, you can set a minimum and maximum position for the camera.
      // Ensure camera.position.x and camera.position.y stay within certain bounds.
    }
  }