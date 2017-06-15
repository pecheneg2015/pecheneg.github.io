    var stationList = [] ;
    var currentStationIndex = 0;
    var audio = new Audio();
    var vol = 0.5;
    audio.controls = true;
    audio.autoplay = true;
    audio.volume = vol;
    audio.id = "aud";
    audio.crossOrigin="anonymous";
    audio.style.display= "none";
    document.body.appendChild(audio);

    $(document).ready(function(){
        $.getJSON( {
             url:  "stations.json",
             dataType: 'json',
             async: false,
             success: function(result) {
             stationList = result;
             result.forEach(function(item, i) {
                    $(".menu>ul").append('<a href="#" data-active="0" data-station-index="'+ i +'"><li>'+ item["name"]+'</li></a>');
                     
                });
        }
        });
        $(".menu>ul>a").first().attr("data-active","1");
         $( "input[name='volumeValueSmall'],input[name='volumeValueBig']" ).val(vol);
    if (stationList[0]["streams"][0]["stream"]){
        audio.src = "https://cors-anywhere.herokuapp.com/"+stationList[currentStationIndex]["streams"][0]["stream"];
         $(".marquee").text(stationList[currentStationIndex]["name"]);
    }else{
    audio.src = 'http://online.radioc.ru:8000/radioc';}  
    });

    $(".menu  ul").on("click", "a", function(){
        $(".menu>ul>a").attr("data-active","0");
        currentStationIndex = $(this).attr("data-station-index");
        $(".menu>ul>a[data-station-index='"+currentStationIndex+"']").attr("data-active","1");
      
        audio.src = "https://cors-anywhere.herokuapp.com/"+stationList[currentStationIndex]["streams"][0]["stream"];
        
        $(".marquee").text(stationList[currentStationIndex]["name"]);
         $( ".menu" ).slideToggle( "slow");
     });

    $( ".iconDown" ).click(function() {
        $( ".menu" ).slideToggle( "slow");
    });

    $( ".play" ).click(function() {
        audio.pause();
        $(".play").hide();
        $(".pause").show();
    });

    $( ".pause" ).click(function() {
        audio.play();
        $(".pause").hide();
        $(".play").show();

    });

    $( ".maxVolume" ).click(function() {
        vol = audio.volume;
        audio.volume = 0;
        $( "input[name='volumeValueSmall'],input[name='volumeValueBig']" ).val(0);
        $(".maxVolume").hide();
        $(".minVolume").show();
    });

    $( ".minVolume" ).click(function() {
        audio.volume = vol;
       $( "input[name='volumeValueSmall'],input[name='volumeValueBig']" ).val(vol);
        $(".minVolume").hide();
        $(".maxVolume").show();

    });

    $( "input[name='volumeValueSmall']" ).mousemove(function(){
        vol = $("input[name='volumeValueSmall']").val();
         $( "input[name='volumeValueBig']" ).val(vol);
        audio.volume = vol;
    })

    $( "input[name='volumeValueBig']" ).mousemove(function(){
        vol = $("input[name='volumeValueBig']").val();
         $( "input[name='volumeValueSmall']" ).val(vol);
        audio.volume = vol;
    })

     $( ".next" ).click(function() {
         if(currentStationIndex < stationList.length--)
         {
            $(".menu>ul>a").attr("data-active","0");
            currentStationIndex++;
            $(".menu>ul>a[data-station-index='"+currentStationIndex+"']").attr("data-active","1");
            audio.src = "https://cors-anywhere.herokuapp.com/"+stationList[currentStationIndex]["streams"][0]["stream"];
        
        $(".marquee").text(stationList[currentStationIndex]["name"]);
         }
    });

    $( ".prev" ).click(function() {
    if(currentStationIndex > 0)
         {
              $(".menu>ul>a").attr("data-active","0");
             currentStationIndex--;
             $(".menu>ul>a[data-station-index='"+currentStationIndex+"']").attr("data-active","1");
            audio.src = "https://cors-anywhere.herokuapp.com/"+stationList[currentStationIndex]["streams"][0]["stream"];
            $(".marquee").text(stationList[currentStationIndex]["name"]);
         }
    });

    /*     ВОЗНЯ СО ЗВУКОМ     */
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();
    window.addEventListener('load', function(e) {
        var source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }, false);
    analyser.fftSize = 64;
    var size = Math.floor(analyser.fftSize/2);
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var frequencyData = new Uint8Array(size);
    /*          РАБОТА СО СЦЕНОЙ        */
    var scene = new THREE.Scene(); // создаём новую сцену
    var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 1000 ); // добавляем камеру. Немного её поворачиваем и поворачиваем
        camera.position.y=5;
        camera.position.x=-5;
        camera.rotation.x =0 * Math.PI / 180;
        camera.rotation.y = -45* Math.PI / 180	
        var renderer = new THREE.WebGLRenderer({ antialias: true });// создаём объект,в котором всё будет рендериться
        if(window.innerWidth<768){
            renderer.setSize( window.innerWidth, window.innerHeight-100 );// задаём его размеры
        }    
        else{
            renderer.setSize( window.innerWidth, window.innerHeight-50);// задаём его размеры
        }
        
		document.body.appendChild( renderer.domElement );//приклеиваем его к body
        /* СОЗДАЁМ КУЧУ КУБИКОВ.НАЧАЛО.*/
        var geometry = new THREE.BoxGeometry( 1, 0.01, 1 );// Определяем геометрию
        geometry.dynamic = true;
        geometry.verticesNeedUpdate = true;
        geometry.normalsNeedUpdate = true;
        geometry.dirtyColors = true;
        var cubes = [];
        var positionX = 0;
        frequencyData.forEach(function(item, i) { 
            cubes[i] =  new THREE.Mesh( geometry,  new THREE.MeshPhongMaterial( { color: 0x00ff00 } ) );
            color = i*15;
            cubes[i].material.color.setHSL( (15*i+1)/360, 1, 0.5);;
            cubes[i].position.set(positionX,0.001,0);
            positionX = positionX+1.25;
            scene.add(cubes[i])
        });
        /*        ДОБАВЛЯЕМ ИСТОЧНИК СВЕТА             */
        var light = new THREE.AmbientLight( 0xa0a0a0 ); 
        scene.add( light );
        /*          СОЗДАЁМ "ЗЕРКАЛЬНЫЙ ПОЛ"            */
        var groundMirror = new THREE.Mirror( 100, 100, { clipBias: 0.003, textureWidth: 2048, textureHeight:2048, color: 0x444444} );
        groundMirror.position.set(0,0,0);
        groundMirror.rotateX(  -Math.PI/2 );
		scene.add( groundMirror );
		camera.position.z =10;// Задаём положение камеры must be 25 
        var render = function () {
				requestAnimationFrame( render );
                analyser.getByteFrequencyData(frequencyData);
                frequencyData.forEach(function(item, i) {
                    item = 15*item;
                    item = item.toFixed(2);
                    cubes[i].material.color.setHSL( (15*i+1)/360, 1, 0.5);
                    cubes[i].scale.y = (item+1)/256*100;
                });
                renderer.render(scene, camera);
		};
        render();