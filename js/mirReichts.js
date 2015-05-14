var container, stats;

			var camera, controls, scene, renderer;

			init();
			render();
      var activColor = new THREE.Color(0.55,0.14,0.14);
      var normalColor = new THREE.Color(1,0.83,0.61);

			function animate() {
				requestAnimationFrame(animate);
				controls.update();
			}

			function init() {
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
       camera.position.z = 50;



				scene = new THREE.Scene();



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

				// lights
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

				// renderer
				renderer = new THREE.WebGLRenderer( { antialias: false } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container = document.getElementById( 'body' );
				container.appendChild( renderer.domElement );

        controls = new THREE.TrackballControls( camera );

  				controls.rotateSpeed = 1.2;
  				controls.zoomSpeed = 0.8;
  				controls.panSpeed = 0.8;

  				controls.noZoom = false;
  				controls.noPan = false;

  				controls.staticMoving = false;
  				controls.dynamicDampingFactor = 0.3;

  				controls.keys = [ 65, 83, 68 ];

  				controls.addEventListener( 'change', render );


				//
				window.addEventListener( 'resize', onWindowResize, false );
				animate();
			}

      function prepareCol(collada, name) {
         // General configuration of the .obj files while loading
         var dae = collada.scene;
         //  var skin = collada.skins[ 0 ];
         dae.name = name;
         dae.position.set(0,0,0);
         dae.traverse(function(child) {
               if(child instanceof THREE.Mesh) {
                 child.material.color = normalColor;
               }
           });
        	scene.add(dae);
      }

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				render();
			}

			function render() {
				renderer.render( scene, camera );

			}
