import * as THREE from 'three'
import React, { useState, useMemo } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import niceColors from 'nice-color-palettes'
import { Physics, usePlane, useBox } from 'use-cannon'

function Plane(props) {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <shadowMaterial attach="material" color="#171717" />
    </mesh>
  )
}

function Cubes({ number }) {
  const [ref, { at }] = useBox(() => ({
    mass: 1,
    args: [0.05, 0.05, 0.05],
    position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
  }))

  const colors = useMemo(() => {
    const array = new Float32Array(number * 3)
    const color = new THREE.Color()
    for (let i = 0; i < number; i++)
      color
        .set(niceColors[17][Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(array, i * 3)
    return array
  }, [number])

  useFrame(() => at(Math.floor(Math.random() * number)).position.set(0, Math.random() * 2, 0))

  return (
    <instancedMesh receiveShadow castShadow ref={ref} args={[null, null, number]}>
      <boxBufferGeometry attach="geometry" args={[0.1, 0.1, 0.1]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colors, 3]} />
      </boxBufferGeometry>
      <meshLambertMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}

export default ({ maxSubSteps }) => {
  const [number, setNumber] = useState(200)

  return (
    <>
      <div>
        <input
          type="range"
          value={number}
          onChange={(e) => setNumber(+e.target.value)}
          step={5}
          min={5}
          max={600}
          style={{ width: 'calc( 100% - 90px )' }}
        />
        <span>{number} cubes</span>
      </div>
      <Canvas
        key={number}
        shadowMap
        sRGB
        gl={{ alpha: false }}
        camera={{ position: [-1, 1, 2.5], fov: 50 }}
        onCreated={({ scene }) => (scene.background = new THREE.Color('lightblue'))}>
        <hemisphereLight intensity={0.35} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
        />
        <Physics broadphase="SAP" maxSubSteps={maxSubSteps}>
          <Plane rotation={[-Math.PI / 2, 0, 0]} />
          <Cubes number={number} />
        </Physics>
      </Canvas>
    </>
  )
}
