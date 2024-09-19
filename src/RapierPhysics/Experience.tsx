import { Box, Gltf, OrbitControls, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat, RigidBody } from "@react-three/rapier";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import Controller from "ecctrl";
import { Controls } from "../app";
// useGLTF.preload("public/assets/Grumpy_Girl.glb");
const GrumpyEunbi = (props) => {
  const grumpy_Girl = useGLTF("public/assets/Grumpy_Girl.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={grumpy_Girl.nodes.mesh_0.geometry}
        material={grumpy_Girl.nodes.mesh_0.material}
      ></mesh>
    </group>
  );
};

export default function Experience() {
  const [hover, setHover] = useState(false);
  const [start, setStart] = useState(false);
  const cubeRef = useRef();
  const kickerRef = useRef();
  const isOnFloor = useRef(true);
  const jumpImpulse = 5;
  const movementImpulse = 0.1;
  const grumpy_Girl = useGLTF("public/assets/Grumpy_Girl.glb");
  console.log(grumpy_Girl);
  const jump = () => {
    if (isOnFloor.current) {
      cubeRef.current.applyImpulse({ x: 0, y: jumpImpulse, z: 0 });
    }
  };

  const handleMovement = (pressedKeys) => {
    if (!isOnFloor.current) return;

    const impulses = {
      right: { x: movementImpulse, y: 0, z: 0 },
      left: { x: -movementImpulse, y: 0, z: 0 },
      back: { x: 0, y: 0, z: movementImpulse },
      forward: { x: 0, y: 0, z: -movementImpulse },
    };

    Object.keys(pressedKeys).forEach((key) => {
      if (pressedKeys[key]) {
        cubeRef.current.applyImpulse(impulses[key]);
      }
    });
  };

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const pressedKeys = {
    left: useKeyboardControls((state) => state[Controls.left]),
    right: useKeyboardControls((state) => state[Controls.right]),
    back: useKeyboardControls((state) => state[Controls.back]),
    forward: useKeyboardControls((state) => state[Controls.forward]),
  };
  const speed = useRef(5);

  const kickerMove = (delta) => {
    const curRotation = quat(kickerRef.current.rotation());
    const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * 4
    );
    curRotation.multiply(incrementRotation);
    kickerRef.current.setNextKinematicRotation(curRotation);

    speed.current += delta;
  };
  useFrame((_, delta) => {
    if (jumpPressed) jump();
    handleMovement(pressedKeys);
    if (!start) {
      return;
    }
    kickerMove(delta);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />

      <RigidBody
        position={[-2.5, 1, 0]}
        ref={cubeRef}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject.name === "floor") isOnFloor.current = true;
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject.name === "floor") isOnFloor.current = false;
        }}
      >
        {/* <Box
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          onClick={() => setStart(true)}
        >
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box> */}
      </RigidBody>
      <Controller maxVelLimit={5}>
        {/* <GrumpyEunbi
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onClick={() => setStart(true)}
          /> */}
        <Gltf
          castShadow
          receiveShadow
          scale={0.315}
          position={[0, -0.55, 0]}
          src="/assets/Grumpy_Girl.glb"
        />
      </Controller>
      <RigidBody type="kinematicPosition" position={[0, 0.75, 0]} ref={kickerRef}>
        <group position={[2.5, 0, 0]}>
          <Box args={[5, 0.5, 0.5]}>
            <meshStandardMaterial color="peachpuff" />
          </Box>
        </group>
      </RigidBody>
      <RigidBody type="fixed" name="floor">
        <Box position={[0, 0, 0]} args={[10, 1, 10]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
}
