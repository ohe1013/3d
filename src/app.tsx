import { KeyboardControls } from "@react-three/drei";
import Experience from "./RapierPhysics/Experience";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useMemo } from "react";

export const Controls = {
  forward: "forward",
  back: "backward",
  left: "leftward",
  right: "rightward",
  jump: "jump",
};
export default function AppRapierPhysics() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );
  return (
    <KeyboardControls map={map}>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
        <color attach="background" args={["#ececec"]} />
        <Physics debug>
          <Experience />
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}
