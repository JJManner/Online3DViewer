//import { SubCoord3D } from '../geometry/coord3d.js';
import { ProjectionMode } from '../viewer/camera.js';
import { ShadingType } from '../threejs/threeutils.js';

import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const MANAGER = new LoadingManager();
const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;
const KTX2_LOADER = new KTX2Loader(MANAGER).setTranscoderPath(
	`${THREE_PATH}/examples/jsm/libs/basis/`,
);
import * as THREE from 'three';

    import {
        AmbientLight,
        AnimationMixer,
        AxesHelper,
        Box3,
        Cache,
        Color,
        DirectionalLight,
        GridHelper,
        HemisphereLight,
        LoaderUtils,
        LoadingManager,
        PMREMGenerator,
        PerspectiveCamera,
        PointsMaterial,
        REVISION,
        Scene,
        SkeletonHelper,
        Vector3,
        WebGLRenderer,
        LinearToneMapping,
        ACESFilmicToneMapping,
    } from 'three';

/**
 * Environment settings object.
 */
export class EnvironmentSettings
{
    /**
     * @param pbrTextureMap
     * @param {boolean} backgroundIsEnvMap Use the environment map as background.
     */
    constructor (pbrTextureMap, backgroundIsEnvMap)
    {
        this.pbrTextureMap = pbrTextureMap;
        this.backgroundIsEnvMap = backgroundIsEnvMap;
    }

    /**
     * Creates a clone of the object.
     * @returns {EnvironmentSettings}
     */
    Clone ()
    {
        let pbrTextureMap = null;
        if (pbrTextureMap == !null) {
            new Promise((resolve, reject) => {
			new EXRLoader().load(
				'assets/envmaps/hansaplatz_1k_x.exr',
				(texture) => {
					const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
					this.pmremGenerator.dispose();

					resolve({ envMap });
				},
				undefined,
				reject,
			);
		});
        }
        return new EnvironmentSettings (pbrTextureMap, this.backgroundIsEnvMap);
    }
}

export class ShadingModel
{
    constructor (scene)
    {
        this.scene = scene;

        this.type = ShadingType.Phong;
        this.projectionMode = ProjectionMode.Perspective;
        this.ambientLight = new THREE.AmbientLight (0x888888, 1.0 * Math.PI);
        this.directionalLight = new THREE.DirectionalLight (0x888888, 1.0 * Math.PI);
        this.environmentSettings = new EnvironmentSettings (null, false);
        this.environment = null;

        this.scene.add (this.ambientLight);
        this.scene.add (this.directionalLight);

            this.renderer = window.renderer = new WebGLRenderer({ antialias: true });
            /*this.renderer.setClearColor(0xcccccc);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(el.clientWidth, el.clientHeight);*/

            this.pmremGenerator = new PMREMGenerator(this.renderer);
            this.pmremGenerator.compileEquirectangularShader();

            const loader = new GLTFLoader(MANAGER)
				.setKTX2Loader(KTX2_LOADER.detectSupport(this.renderer))

    }

    SetShadingType (type)
    {
        this.type = type;
        this.UpdateShading ();
    }

    SetProjectionMode (projectionMode)
    {
        this.projectionMode = projectionMode;
        this.UpdateShading ();
    }

    UpdateShading ()
    {
        if (this.type === ShadingType.Phong) {
            this.ambientLight.color.set (0x888888);
            this.directionalLight.color.set (0x888888);
            this.scene.environment = null;
        } else if (this.type === ShadingType.Physical) {
            this.ambientLight.color.set (0x000000);
            this.directionalLight.color.set (0x555555);
            //this.scene.environment = this.environment;
            this.scene.environment = this.envMap;
            console.log('Physical');
        }
        if (this.environmentSettings.backgroundIsEnvMap && this.projectionMode === ProjectionMode.Perspective) {
            //this.scene.background = this.environment;
            this.scene.background = this.environment;
        } else {
            this.scene.background = null;
        }
    }

    SetEnvironmentMapSettings (environmentSettings)
    {
        /*let loader = new THREE.CubeTextureLoader ();
        this.environment = loader.load (environmentSettings.pbrTextureMap, (texture) => {
            texture.colorSpace = THREE.LinearSRGBColorSpace;
            onLoaded ();
        });*/
        this.environmentSettings = environmentSettings;
    }

    UpdateByCamera (camera)
    {
        //const lightDir = SubCoord3D (camera.eye, camera.center);
        //this.directionalLight.position.set (lightDir.x, lightDir.y, lightDir.z);
    }
}
