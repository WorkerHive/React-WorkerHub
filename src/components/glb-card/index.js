import React from 'react';


export default function GLBCard(props){
    let canvas;
    let scene;
    let engine;

  
    React.useEffect(() => {
        const onResizeWindow = () => {
            if (engine) {
              engine.resize();
            }
        }
        if(props.data){

        
        if(!engine){
        engine = new window.BABYLON.Engine(
            canvas,
            true
        )
        }

        if(!scene){
        scene = new window.BABYLON.Scene(engine)
        scene.createDefaultEnvironment();
        }

        var camera = new window.BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new window.BABYLON.Vector3(0, 0, 10), scene);
      
        camera.setTarget(window.BABYLON.Vector3.Zero());
        camera.minZ = 0;
        camera.wheelPrecision = 7;
        camera.speed = 0.5;

        console.log(props.data)

        window.BABYLON.SceneLoader.ImportMesh(null, "", props.data, scene, (e) => {
            console.log(e)   
        }, null, null, ".glb")
      
        camera.attachControl(canvas, false);
        window.addEventListener("resize", onResizeWindow);
        engine.runRenderLoop(function(){
            scene.render();
        });

   
    }
    return () => {
        if(engine){
            engine.stopRenderLoop()
        }
        if(scene) {
            scene.dispose()
            scene = null
        }

        window.removeEventListener('resize', onResizeWindow)
    }
    }, [props.data])

    const onCanvasLoad = (c) => {
        if(c !== null){
            canvas = c;
        }
    }

    return (
        <canvas style={{width: '100%'}} ref={onCanvasLoad}/>
    )
}