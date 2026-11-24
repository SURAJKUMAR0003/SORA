import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useHospital } from '../context/HospitalContext';

export const Sora3DViewer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { robotState, isVoiceSpeaking } = useHospital();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || (compact ? 240 : 360);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    camera.lookAt(0, 0.6, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00e5ff, 2.5);
    dirLight.position.set(2, 4, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x3b82f6, 1.8);
    backLight.position.set(-2, 2, -2);
    scene.add(backLight);

    // Robot Master Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Base Chassis (White rounded futuristic cylinder/box)
    const chassisGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.75, 32);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.1
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.55;
    robotGroup.add(chassis);

    // Cyan Trim Ring on Base
    const ringGeo = new THREE.TorusGeometry(0.58, 0.03, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.35;
    robotGroup.add(ring);

    // Front Storage Compartment Door
    const doorGeo = new THREE.BoxGeometry(0.35, 0.3, 0.05);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4
    });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 0.45, 0.55);
    robotGroup.add(door);

    // Front Mounted Touchscreen
    const screenGeo = new THREE.BoxGeometry(0.48, 0.32, 0.04);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.72, 0.52);
    screen.rotation.x = -0.15;
    robotGroup.add(screen);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.15, 16);
    const neckMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.y = 1.0;
    robotGroup.add(neck);

    // Head Unit (Rounded Sphere/Capsule)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.25;
    robotGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.42, 32, 24);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.05
    });
    const head = new THREE.Mesh(headGeo, headMat);
    headGroup.add(head);

    // Curved Dark Visor Screen for Eyes / Expressions
    const visorGeo = new THREE.SphereGeometry(0.43, 32, 16, 0, Math.PI, 0, Math.PI * 0.55);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.1,
      metalness: 0.8
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.position.z = 0.03;
    headGroup.add(visor);

    // Eye Indicators (Cyan glowing dots)
    const eyeGeo = new THREE.PlaneGeometry(0.09, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide
    });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.14, 0.06, 0.41);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.14, 0.06, 0.41);
    headGroup.add(rightEye);

    // Top LiDAR / Camera Sensor Module
    const lidarGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const lidarMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3
    });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.position.y = 0.44;
    headGroup.add(lidar);

    // Wheels (Left & Right Powered Drive Wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
    leftWheel.rotation.z = Math.PI / 2;
    leftWheel.position.set(-0.58, 0.16, 0);
    robotGroup.add(leftWheel);

    const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);
    rightWheel.rotation.z = Math.PI / 2;
    rightWheel.position.set(0.58, 0.16, 0);
    robotGroup.add(rightWheel);

    // Front/Back Caster Wheels (Spheres)
    const casterGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const casterMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });

    const frontCaster = new THREE.Mesh(casterGeo, casterMat);
    frontCaster.position.set(0, 0.08, 0.45);
    robotGroup.add(frontCaster);

    const backCaster = new THREE.Mesh(casterGeo, casterMat);
    backCaster.position.set(0, 0.08, -0.45);
    robotGroup.add(backCaster);

    // Ground Shadow Plate / Base Glow
    const groundGeo = new THREE.CircleGeometry(0.85, 32);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.18
    });
    const groundShadow = new THREE.Mesh(groundGeo, groundMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Mouse Drag Interaction for Rotating SORA in 3D
    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - prevMouseX;
      robotGroup.rotation.y += delta * 0.01;
      prevMouseX = e.clientX;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle breathing / slight vertical bobbing
      robotGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.025;

      // Gentle auto-rotation when idle if user isn't dragging
      if (!isDragging && robotState.status !== 'navigating') {
        robotGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.25;
      }

      // Wheel rotation during navigation
      if (robotState.status === 'navigating') {
        leftWheel.rotation.x += 0.15;
        rightWheel.rotation.x += 0.15;
      }

      // Head scanning or looking
      headGroup.rotation.y = Math.sin(elapsedTime * 1.2) * 0.2;
      lidar.rotation.y += 0.08;

      // Speaking animation on eyes/visor
      if (isVoiceSpeaking) {
        const eyeScaleY = 0.8 + Math.sin(elapsedTime * 15) * 0.6;
        leftEye.scale.set(1, Math.max(0.2, eyeScaleY), 1);
        rightEye.scale.set(1, Math.max(0.2, eyeScaleY), 1);
        screenMat.emissiveIntensity = 0.6 + Math.sin(elapsedTime * 12) * 0.3;
      } else {
        leftEye.scale.set(1, 1, 1);
        rightEye.scale.set(1, 1, 1);
        screenMat.emissiveIntensity = 0.35;
      }

      // Emergency alert flash
      if (robotState.emergencyActive) {
        ringMat.color.setHex(0xff0044);
        ringMat.emissive.setHex(0xff0044);
        ringMat.emissiveIntensity = 1 + Math.sin(elapsedTime * 10) * 0.8;
      } else {
        ringMat.color.setHex(0x00e5ff);
        ringMat.emissive.setHex(0x00e5ff);
        ringMat.emissiveIntensity = 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || (compact ? 240 : 360);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [compact, isVoiceSpeaking, robotState.emergencyActive, robotState.status]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
      />
      
      {/* 3D Robot Telemetry Overlay Label */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 font-mono-num pointer-events-none bg-navy-950/70 backdrop-blur px-2.5 py-1 rounded-lg border border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          SORA 3D PHYSICAL MODEL
        </span>
        <span className="text-slate-400">Drag to Orbit 360°</span>
      </div>
    </div>
  );
};
