var init = function(containerId) {

    var container;
    var id;
    var camera, scene, renderer;
    var mouse, raycaster, controls, hemiLight;
    var color1, color2;

    function init(containerID) {
        // Will setup all needed variables
        scene = new THREE.Scene();
        id = containerID.replace("Body", "");
        container = document.getElementById(containerID);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(0, -240, 1 );
        camera.lookAt(scene.position);
        scene.add(camera);

        // Light
        var light = new THREE.PointLight(0xfffff3, 0.8);
	          light.position.set(-100,200,100);
            scene.add(light);
        var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
            light2.position.set(200,200,100);
            scene.add(light2);
        var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
            light3.position.set(150,200,-100);
            scene.add(light3);
        var light4 = new THREE.PointLight(0xFFFFFF, 0.5);
            light4.position.set(50,-150,100);
            scene.add(light4);


        // Controls
        controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 10;
  			controls.zoomSpeed = 1.2;
  			controls.panSpeed = 0.8;
  			controls.noZoom = false;
  			controls.noPan = false;
        controls.maxDistance = 60;
        controls.minDistance = 10;
        controls.keys = [ 65, 83, 68 ];
				controls.addEventListener( 'change', render );


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
        loader.load( 'objects/torso.dae', function ( collada ) {
            prepareCol( collada, "torso" );
        }, onProgress, onError );
        loader.load( 'objects/arm_left.dae',  function ( collada ) {
            prepareCol( collada, "arm_left" );
        }, onProgress, onError );
        loader.load( 'objects/arm_right.dae', function ( collada ) {
            prepareCol( collada, "arm_right" );
        }, onProgress, onError );
        loader.load( 'objects/leg_right.dae', function ( collada ) {
            prepareCol( collada, "leg_right" );
        }, onProgress, onError );
        loader.load( 'objects/leg_left.dae', function ( collada ) {
            prepareCol( collada, "leg_left" );
        }, onProgress, onError );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(800, 800);
        renderer.setClearColor(0xffffff, 1);
        container.appendChild(renderer.domElement);


        document.addEventListener("mouseover", function(e) {
            checkBodyActive(e);
        }, false);
        document.addEventListener("click", onClick, false);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        camera.aspect = 1;
        camera.updateProjectionMatrix();
        animate();
        render();

        activColor = new THREE.Color(0.55,0.14,0.14);
        normalColor = new THREE.Color(1,0.83,0.61);

    }

    function checkBodyActive(event) {
        // Checks, if the current body is active
        if(document.elementFromPoint(event.clientX, event.clientY) == renderer.domElement) {
            controls.enabled = true;
            animate();
            return true;
        }
        else {
            controls.enabled = false;
            return false;
        }
    }

    function changeTexture(part) {
        // changes the texture of the selected body part
        scene.children[part].traverse( function ( child ) {
            if (child instanceof THREE.Mesh) {
                // Texture must be changed
                //  console.log(scene);
                if(child.material.color == activColor) {
                    // Texture2 is already equipped, unequip it
                    child.material.color = normalColor;
                    save(false);
                } else {
                    // Equip texture2
                    child.material.color = activColor;
                    //  console.log(scene);
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
        if(checkBodyActive(event) == false) {
            return;
        }

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

    function prepareCol(collada, name){
        // General configuration of the .obj files while loading
        var dae = collada.scene;
      //  var skin = collada.skins[ 0 ];
        dae.name = name;
      //  dae.position.set(0,-30,-5);//x,z,y- if you think in blender dimensions ;)
      //  dae.position.set(0,0,0);
      //  dae.scale.set(3,3,3);
        dae.traverse(function(child) {
             if(child instanceof THREE.Mesh) {
               child.material.color = normalColor;
             }
         });
      	scene.add(dae);
    }

    function animate() {
        // On every frame we need to calculate the new camera position
        // and have it look exactly at the center of our scene.
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
    }

    function render() {

				renderer.render( scene, camera );
        camera.updateProjectionMatrix();


			}

    init(containerId);
};
