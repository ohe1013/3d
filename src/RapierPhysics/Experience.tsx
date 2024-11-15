import { Box, Environment, OrthographicCamera, PositionalAudio } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import CharacterController from "../features/Character/CharacterController";

export default function Experience() {
  const shadowCameraRef = useRef(null);
  return (
    <>
      <ConcertAudio />
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Physics>
        <CharacterController />
        <Ground />
      </Physics>
    </>
  );
}
function ConcertAudio() {
  const sound = useRef(null);
  let isPlay = false;
  return (
    <>
      {/* PositionalAudio가 공연장에서 소리를 재생합니다 */}
      <PositionalAudio
        ref={sound}
        url="/assets/fire_work.mp3"
        distance={5} // 거리에 따라 소리 크기가 조정됩니다
        loop
        autoplay={isPlay}
        position={[0, 2, 0]} // 소리의 위치 설정 (무대 중심)
      />
    </>
  );
}
interface GroundProps {
  initialPosition?: [number, number, number];
  size?: [number, number, number];
}

const Ground: React.FC<GroundProps> = ({ initialPosition = [0, -0.5, 0], size = [10, 1, 10] }) => {
  const [groundPositions, setGroundPositions] = useState<[number, number, number][]>([
    initialPosition,
  ]);

  useFrame((state) => {
    const { camera } = state;
    const latestGround = groundPositions[groundPositions.length - 1];

    // 새로운 바닥 생성 조건 (예: 카메라 기준으로 생성)
    if (camera.position.x > latestGround[0] - 50 || camera.position.z > latestGround[2] - 50) {
      setGroundPositions((prev) => [
        ...prev,
        [latestGround[0] + size[0], initialPosition[1], latestGround[2] + size[2]],
      ]);
    }
  });
  return (
    <>
      {groundPositions.map((pos, index) => (
        <RigidBody key={index} type="fixed" position={pos}>
          <Box args={size}>
            <meshStandardMaterial color={index % 2 === 0 ? "gray" : "lightgray"} />
          </Box>
        </RigidBody>
      ))}
    </>
  );
};
