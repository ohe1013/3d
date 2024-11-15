import { KeyboardControls } from "@react-three/drei";
import Experience from "./RapierPhysics/Experience";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";

export const Controls = {
  forward: "forward",
  back: "backward",
  left: "leftward",
  right: "rightward",
  jump: "jump",
  run: "run",
};
export default function AppRapierPhysics() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.run, keys: ["Shift"] },
    ],
    []
  );

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas
          shadows
          camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
          style={{
            touchAction: "none",
          }}
        >
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Canvas>
      </KeyboardControls>
    </>
  );
}
