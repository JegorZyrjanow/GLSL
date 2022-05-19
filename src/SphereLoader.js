import * as THREE from 'three'

export default class SphereLoader {
  #_geometry
  #_material
  #_mesh

  constructor(geometry, material) {
    this.#_geometry = geometry
    this.#_material = material
  }

  get mesh() {
    return this.#_mesh
  }

  create() {
    return new Promise((resolve, reject) => {
      this.#_mesh = new THREE.Mesh(this.#_geometry, this.#_material)
      if (this.#_mesh != undefined) {
        resolve("--> sphere is created")
      }
      else {
        reject('--> some shit happened')
      }
    })
  }

  setDisplacement() {
    if (this.#_mesh != undefined) {
      // IS NOT WORKING
      let displacement = new Float32Array(this.#_geometry.attributes.position.array.length)

      for (let i = 0; i < this.#_geometry.attributes.position.array.length; i++) {
        let rand = (Math.random() * 2) - 1
        displacement[i] = rand
      }

      this.#_geometry.setAttribute(
        'displacement',
        new THREE.BufferAttribute(displacement, 1)
      )

      this.#_mesh = new THREE.Mesh(this.#_geometry, this.#_material)
    }
    else {
      console.log('--> mesh is not loaded yet.')
    }
  }
}
