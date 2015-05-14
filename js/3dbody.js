var init = function(containerId) {

    var container;
    var id;
    var camera, scene, renderer;
    var mouse, raycaster, controls, hemiLight;


    function init(containerID) {
        // Will setup all needed variables
        scene = new THREE.Scene();
        id = containerID.replace("Body", "");
        container = document.getElementById(containerID);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 50;
        camera.aspect = 1;
        scene.add(camera);
        camera.lookAt(new THREE.Vector3(0,0,0));

        // Helpers
        //axes
        var axes = new THREE.AxisHelper(100);
        scene.add(axes);

        // Lights
        var light;
        light = new THREE.PointLight(0xfffff3, 0.8);
        light.position.set(0,0,100);
        light = new THREE.PointLight(0xd7f0ff, 0.2);
        light.position.set(0,0,-100);
        scene.add(light);
        light = new THREE.PointLight(0xFFFFFF, 0.5);
        light.position.set(100,0,0);
        scene.add(light);
        light = new THREE.PointLight(0xFFFFFF, 0.5);
        light.position.set(-100,0,0);
        scene.add(light);
        light = new THREE.PointLight(0xFFFFFF, 0.5);
        light.position.set(0,100,0);
        scene.add(light);
        light = new THREE.PointLight(0xFFFFFF, 0.5);
        light.position.set(0,-100,0);
        scene.add(light);


        // Model
        var onProgress = function ( xhr ) {
            // Only necessary if the obj-file-size is very large
        };
        var onError = function ( xhr ) {
            // Something went wrong during loading obj-file
            console.log("Error, please report to the devs");
        };

        var loader = new THREE.ColladaLoader();

        // Load the 3D Files
        loader.load( 'objects/head.dae',  function ( collada ) {
            prepareCol( collada, "head" );
        }, onProgress, onError );
        loader.load( 'objects/basin.dae',  function ( collada ) {
            prepareCol( collada, "basin" );
        }, onProgress, onError );
        loader.load( 'objects/chest_front.dae', function ( collada ) {
            prepareCol( collada, "chest_front" );
        }, onProgress, onError );
        loader.load( 'objects/chest_back.dae',  function ( collada ) {
            prepareCol( collada, "chest_back" );
        }, onProgress, onError );
        loader.load( 'objects/belly_front.dae', function ( collada ) {
            prepareCol( collada, "belly_front" );
        }, onProgress, onError );
        loader.load( 'objects/belly_back.dae',  function ( collada ) {
            prepareCol( collada, "belly_back" );
        }, onProgress, onError );
        loader.load( 'objects/lowerLeg_right.dae', function ( collada ) {
            prepareCol( collada, "lowerLeg_right" );
        }, onProgress, onError );
        loader.load( 'objects/lowerLeg_left.dae', function ( collada ) {
            prepareCol( collada, "lowerLeg_left" );
        }, onProgress, onError );
        loader.load( 'objects/knee_left.dae',  function ( collada ) {
            prepareCol( collada, "knee_keft" );
        }, onProgress, onError );
        loader.load( 'objects/knee_right.dae', function ( collada ) {
            prepareCol( collada, "knee_right" );
        }, onProgress, onError );
        loader.load( 'objects/upperLeg_right.dae',  function ( collada ) {
            prepareCol( collada, "upperLeg_right" );
        }, onProgress, onError );
        loader.load( 'objects/upperLeg_left.dae', function ( collada ) {
            prepareCol( collada, "upperLeg_left" );
        }, onProgress, onError );
        loader.load( 'objects/upperArm_right.dae', function ( collada ) {
            prepareCol( collada, "upperArm_right" );
        }, onProgress, onError );
        loader.load( 'objects/upperArm_left.dae', function ( collada ) {
            prepareCol( collada, "upperArm_left" );
        }, onProgress, onError );
        loader.load( 'objects/lowerArm_left.dae',  function ( collada ) {
            prepareCol( collada, "lowerArm_left" );
        }, onProgress, onError );
        loader.load( 'objects/lowerArm_right.dae', function ( collada ) {
            prepareCol( collada, "lowerArm_right" );
        }, onProgress, onError );


        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(800, 800);
        renderer.setClearColor(0xffffff, 1);
        container.appendChild(renderer.domElement);
        document.addEventListener("click", onClick, false);

        // Controls
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 1.2;
        controls.zoomSpeed = 0.8;
        controls.panSpeed = 0.4;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.minDistance = 10;
        controls.maxDistance = 55;
        controls.addEventListener( 'change', render );

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        activColor = new THREE.Color(0.55,0.14,0.14);
        normalColor = new THREE.Color(1,0.83,0.61);
        animate();
    }

    function changeTexture(part) {
        // changes the texture of the selected body part
        scene.children[part].traverse( function ( child ) {
            if (child instanceof THREE.Mesh) {
                // Texture must be changed
                if(child.material.color == activColor) {
                    // Texture2 is already equipped, unequip it
                    child.material.color = normalColor;
                    save(false);
                } else {
                    // Equip Texture2
                    child.material.color = activColor;
                    save(true);
                }
            }
        });
    }

    function save(bool) {
        // Will add / delete the selected body regions to hidden input fields to save it to db
        /*if(bool == true) {
            if(id == "Allergy") {
                var input = document.createElement("button");
                input.setAttribute("value", "test");
                document.getElementById("allergies").appendChild(input);
            }
            else if(id == "Pain") {
                var input = document.createElement("button");
                document.getElementById("pain").appendChild(input);
            }
            else if(id == "Injury") {
                var input = document.createElement("button");
                document.getElementById("injuries").appendChild(input);
            }
        }*/
    }

    function onClick(event) {
        // Mouse-Click-Event, used to check if intersects where hit

        mouse.x = (getOffset(event).x / renderer.domElement.width) * 2 - 1;
        mouse.y = -(getOffset(event).y / renderer.domElement.height) * 2 + 1;

        // Create intersect raycasting
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children, true)
        if (intersects.length) {
            var name = intersects[0].object.parent.parent.name;
            for (var j = 0; j < scene.children.length; j++) {
                if (scene.children[j].name == name) {
                    // Found same model as the intersects, change texture
                    changeTexture(j);
                    render();
                }
            }
        }
    }

    function getOffset(event) {
        // Calcs layerX / layerY for the clicked element
        var el = event.target,
            x = 0,
            y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        x = event.clientX - x;
        y = event.clientY - y;

        return { x: x, y: y };
    }

    function prepareCol(collada, name) {
       // General configuration of the .obj files while loading
       var dae = collada.scene;
       //  var skin = collada.skins[ 0 ];
       dae.name = name;
       dae.position.set(0, -10, 0);
       dae.rotation.set( -Math.PI * 0.5, 0, 0 );
       dae.traverse(function(child) {
             if(child instanceof THREE.Mesh) {
               child.material.color = normalColor;
             }
         });
      	scene.add(dae);
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    function render() {
      renderer.render( scene, camera );
    }

    init(containerId);
};
