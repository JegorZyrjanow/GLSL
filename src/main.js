import { resolveConfig } from 'prettier'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import SphereLoader from './SphereLoader'

let scene, camera, renderer, light, container, controls
let shaderMaterial

let sphere
// let displacement
var tangent

function init() {
  // Container
  let element = document.createElement('div')
  element.setAttribute('id', 'container')
  document.body.appendChild(element)
  container = document.getElementById('container')

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    4000
  )
  camera.position.set(50, 0, 0)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 1)
  container.appendChild(renderer.domElement)
  window.addEventListener(
    'resize',
    () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window, innerHeight)
    },
    false
  )
  controls = new OrbitControls(camera, renderer.domElement)

  // Lights
  light = new THREE.AmbientLight(0xffffff, 1, 1000)
  scene.add(light)

  // Sphere
  createSphere()
}

function createSphere() {
  // Geometry
  let geometry
  let createSphereGeo = new Promise(resolve => {
    geometry = new THREE.SphereBufferGeometry(15, 64, 64)
    resolve()
  })
  createSphereGeo.then(() => {
    geometry.computeTangents()
    tangent = new Float32Array(geometry.attributes.tangent.array.length)

    for (let i = 0; i < geometry.attributes.tangent.array.length; i++) {
      tangent[i] = geometry.attributes.tangent.array[i]
    }
    // for (let i = 0; i < geometry.attributes.tangent.array.length; i++) {
    //   geometry.attributes.tangent.array[i] = -geometry.attributes.tangent.array[i];
    // }
  })
  // Texture
  let earthTexture = new THREE.TextureLoader().load('../public/images/earth_atmos_2048.jpg')
  let lightsTexture = new THREE.TextureLoader().load('../public/images/earth_lights_2048.jpg')
  let normalMapImage = new THREE.TextureLoader().load('../public/images/earth_normal_2048.jpg')

  // Material
  shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dTexture: { value: earthTexture },
      nTexture: { value: lightsTexture },
      lightPosition: { value: new THREE.Vector3(10000.0, 0.0, 0.0) }, // replace with var
      color: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
      ambientColor: { value: new THREE.Vector4(0.2, 0.2, 0.2, 1.0) },
      lightColor: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
      amp: { value: 1 },
      baseTexture: { value: earthTexture },
      normalMap: { value: normalMapImage },
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  })

  // Loader
  let sphereLoader = new SphereLoader(geometry, shaderMaterial)
  sphereLoader.create().then( () => {
    sphereLoader.setDisplacement()
    sphere = sphereLoader.mesh
    // displacement = new Float32Array(sphere.geometry.attributes.position.array.length)
    // console.log(sphere.mesh.geometry.attributes.displacement)
    scene.add(sphere)
    animate()
  })

}

let time = 0

function animate() {
  // Update OrbitControls
  controls.update()

  // Other animations


  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  time++
}

init()
