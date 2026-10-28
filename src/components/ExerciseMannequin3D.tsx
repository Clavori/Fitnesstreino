"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { AnimationPattern, MuscleGroup } from "@/types/fitness";

interface ExerciseMannequin3DProps {
  pattern: AnimationPattern;
  muscleGroup: MuscleGroup;
  compact?: boolean;
  isPlaying: boolean;
  speed: number;
  cameraPreset: "side" | "front" | "iso";
}

/**
 * Boneco Biomecânico 3D Procedural em Three.js / WebGL.
 * Possui esqueleto hierárquico articulado, destaque luminoso nos músculos-alvo,
 * equipamentos 3D (barra olímpica, anilhas, halteres, banco e polia) e rotação 360° por toque/arraste.
 */
export const ExerciseMannequin3D: React.FC<ExerciseMannequin3DProps> = ({
  pattern,
  muscleGroup,
  compact = false,
  isPlaying,
  speed,
  cameraPreset,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    isPlaying,
    speed,
    pattern,
    muscleGroup,
    yaw: 0.55,
    pitch: 0.18,
    distance: compact ? 3.55 : 3.3,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.speed = speed;
    stateRef.current.pattern = pattern;
    stateRef.current.muscleGroup = muscleGroup;
  }, [isPlaying, speed, pattern, muscleGroup]);

  useEffect(() => {
    if (cameraPreset === "side") {
      stateRef.current.yaw = Math.PI / 2;
      stateRef.current.pitch = 0.12;
    } else if (cameraPreset === "front") {
      stateRef.current.yaw = 0;
      stateRef.current.pitch = 0.15;
    } else {
      stateRef.current.yaw = 0.65;
      stateRef.current.pitch = 0.2;
    }
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = compact ? 160 : 230;

    // 1. Cena, Câmera e Renderizador WebGL
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Iluminação Esportiva Dramática
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const neonRimLight = new THREE.PointLight(0xccff00, 1.6, 8);
    neonRimLight.position.set(-2.5, 2.5, -2);
    scene.add(neonRimLight);

    const orangeFillLight = new THREE.PointLight(0xff5500, 1.1, 8);
    orangeFillLight.position.set(2.5, 0.5, 2);
    scene.add(orangeFillLight);

    // 3. Piso e Grade Biomecânica 3D
    const gridHelper = new THREE.GridHelper(3.4, 12, 0xccff00, 0x1e293b);
    gridHelper.position.y = -1.02;
    scene.add(gridHelper);

    const platformGeo = new THREE.CylinderGeometry(1.15, 1.25, 0.06, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.5,
      roughness: 0.4,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.05;
    scene.add(platform);

    // 4. Materiais Anatômicos (Corpo Base vs Músculo Ativo Neon)
    const baseBodyMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.25,
    });
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.4,
    });
    const darkArmorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.3,
    });
    const activeMuscleMat = new THREE.MeshStandardMaterial({
      color: 0xccff00,
      emissive: 0x88cc00,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.1,
    });
    const equipMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.6,
    });
    const weightPlateMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff3300,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.4,
    });

    const getMat = (targetMuscles: MuscleGroup[]) =>
      targetMuscles.includes(stateRef.current.muscleGroup)
        ? activeMuscleMat
        : baseBodyMat;

    // 5. Construção do Esqueleto 3D Articulado (Hierarquia Cinemática)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Pelve / Quadril (Centro de gravidade)
    const pelvisGroup = new THREE.Group();
    rootGroup.add(pelvisGroup);

    const pelvisMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.16, 0.22),
      getMat(["Pernas", "Abdômen"])
    );
    pelvisGroup.add(pelvisMesh);

    // Glúteos 3D
    const gluteLeft = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16),
      getMat(["Pernas"])
    );
    gluteLeft.position.set(-0.09, -0.02, -0.08);
    pelvisGroup.add(gluteLeft);

    const gluteRight = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16),
      getMat(["Pernas"])
    );
    gluteRight.position.set(0.09, -0.02, -0.08);
    pelvisGroup.add(gluteRight);

    // Coluna / Abdômen / Tórax
    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, 0.08, 0);
    pelvisGroup.add(spineGroup);

    // Core / Abdômen
    const coreMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.14, 0.24, 16),
      getMat(["Abdômen"])
    );
    coreMesh.position.y = 0.12;
    spineGroup.add(coreMesh);

    // Caixa Torácica / Costas
    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, 0.25, 0);
    spineGroup.add(chestGroup);

    const torsoMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.16, 0.32, 16),
      getMat(["Costas"])
    );
    torsoMesh.position.y = 0.16;
    chestGroup.add(torsoMesh);

    // Peitoral Maior 3D (Placa frontal esculpida)
    const pecsMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.18, 0.12),
      getMat(["Peito"])
    );
    pecsMesh.position.set(0, 0.2, 0.1);
    chestGroup.add(pecsMesh);

    // Grande Dorsal (Asas / Costas 3D)
    const latsMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.24, 0.1),
      getMat(["Costas"])
    );
    latsMesh.position.set(0, 0.18, -0.09);
    chestGroup.add(latsMesh);

    // Pescoço e Cabeça 3D
    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.07, 0.1, 12),
      jointMat
    );
    neckMesh.position.set(0, 0.36, 0);
    chestGroup.add(neckMesh);

    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 24, 24),
      darkArmorMat
    );
    headMesh.scale.set(0.92, 1.12, 0.98);
    headMesh.position.set(0, 0.5, 0.02);
    chestGroup.add(headMesh);

    // Visor luminoso na face para identificar para onde o boneco está olhando
    const visorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.04, 0.06),
      activeMuscleMat
    );
    visorMesh.position.set(0, 0.51, 0.11);
    chestGroup.add(visorMesh);

    // Criador de Braços Simétricos (Ombro -> Braço -> Cotovelo -> Antebraço -> Mão)
    const createArm = (side: -1 | 1) => {
      const shoulderJoint = new THREE.Group();
      shoulderJoint.position.set(side * 0.26, 0.28, 0);
      chestGroup.add(shoulderJoint);

      // Deltoide 3D
      const deltoid = new THREE.Mesh(
        new THREE.SphereGeometry(0.095, 16, 16),
        getMat(["Ombros"])
      );
      shoulderJoint.add(deltoid);

      // Braço (Bíceps frontal + Tríceps posterior)
      const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.058, 0.28, 14),
        getMat(["Bíceps", "Tríceps"])
      );
      upperArm.position.y = -0.14;
      shoulderJoint.add(upperArm);

      // Cotovelo
      const elbowJoint = new THREE.Group();
      elbowJoint.position.set(0, -0.28, 0);
      shoulderJoint.add(elbowJoint);

      const elbowSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 12, 12),
        jointMat
      );
      elbowJoint.add(elbowSphere);

      // Antebraço
      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.042, 0.26, 14),
        baseBodyMat
      );
      forearm.position.y = -0.13;
      elbowJoint.add(forearm);

      // Mão + Halter Individual
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.26, 0);
      elbowJoint.add(handGroup);

      const handMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        jointMat
      );
      handGroup.add(handMesh);

      // Halter 3D acoplado na mão
      const dumbbellGroup = new THREE.Group();
      const dbHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.22, 10),
        jointMat
      );
      dbHandle.rotation.z = Math.PI / 2;
      dumbbellGroup.add(dbHandle);

      const plateL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16),
        weightPlateMat
      );
      plateL.rotation.z = Math.PI / 2;
      plateL.position.x = -0.09;
      dumbbellGroup.add(plateL);

      const plateR = plateL.clone();
      plateR.position.x = 0.09;
      dumbbellGroup.add(plateR);

      handGroup.add(dumbbellGroup);

      return { shoulderJoint, elbowJoint, handGroup, dumbbellGroup };
    };

    const leftArm = createArm(-1);
    const rightArm = createArm(1);

    // Barra Olímpica Longa (para Supino, Agachamento, Terra, Puxada, Remada)
    const barbellGroup = new THREE.Group();
    const barRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.35, 14),
      jointMat
    );
    barRod.rotation.z = Math.PI / 2;
    barbellGroup.add(barRod);

    const bigPlateGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.045, 24);
    const bigPlateL = new THREE.Mesh(bigPlateGeo, weightPlateMat);
    bigPlateL.rotation.z = Math.PI / 2;
    bigPlateL.position.x = -0.52;
    barbellGroup.add(bigPlateL);

    const bigPlateL2 = new THREE.Mesh(bigPlateGeo, activeMuscleMat);
    bigPlateL2.rotation.z = Math.PI / 2;
    bigPlateL2.position.x = -0.58;
    barbellGroup.add(bigPlateL2);

    const bigPlateR = bigPlateL.clone();
    bigPlateR.position.x = 0.52;
    barbellGroup.add(bigPlateR);

    const bigPlateR2 = bigPlateL2.clone();
    bigPlateR2.position.x = 0.58;
    barbellGroup.add(bigPlateR2);

    scene.add(barbellGroup);

    // Banco 3D (Aparece em exercícios de banco como Supino, Remada, Hip Thrust, Leg Press)
    const benchGroup = new THREE.Group();
    const benchPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.08, 1.15),
      equipMat
    );
    benchPad.position.set(0, -0.42, -0.1);
    benchGroup.add(benchPad);

    const legFront = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.56, 10),
      equipMat
    );
    legFront.position.set(0, -0.72, 0.36);
    benchGroup.add(legFront);

    const legBack = legFront.clone();
    legBack.position.set(0, -0.72, -0.52);
    benchGroup.add(legBack);
    scene.add(benchGroup);

    // Criador de Pernas Simétricas (Quadril -> Coxa -> Joelho -> Canela -> Pé)
    const createLeg = (side: -1 | 1) => {
      const hipJoint = new THREE.Group();
      hipJoint.position.set(side * 0.12, -0.06, 0);
      pelvisGroup.add(hipJoint);

      const thighMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.095, 0.075, 0.42, 16),
        getMat(["Pernas"])
      );
      thighMesh.position.y = -0.21;
      hipJoint.add(thighMesh);

      const kneeJoint = new THREE.Group();
      kneeJoint.position.set(0, -0.42, 0);
      hipJoint.add(kneeJoint);

      const kneeSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.068, 14, 14),
        jointMat
      );
      kneeJoint.add(kneeSphere);

      const shinMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.05, 0.42, 16),
        getMat(["Pernas"])
      );
      shinMesh.position.y = -0.21;
      kneeJoint.add(shinMesh);

      const footMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.06, 0.22),
        jointMat
      );
      footMesh.position.set(0, -0.44, 0.05);
      kneeJoint.add(footMesh);

      return { hipJoint, kneeJoint, footMesh };
    };

    const leftLeg = createLeg(-1);
    const rightLeg = createLeg(1);

    // 6. Eventos de Mouse e Touch para Rotação 360° Orbital
    const domElem = renderer.domElement;

    const handlePointerDown = (clientX: number, clientY: number) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastX = clientX;
      stateRef.current.lastY = clientY;
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!stateRef.current.isDragging) return;
      const dx = clientX - stateRef.current.lastX;
      const dy = clientY - stateRef.current.lastY;
      stateRef.current.lastX = clientX;
      stateRef.current.lastY = clientY;
      stateRef.current.yaw -= dx * 0.012;
      stateRef.current.pitch = Math.max(
        -0.35,
        Math.min(0.85, stateRef.current.pitch + dy * 0.008)
      );
    };

    const handlePointerUp = () => {
      stateRef.current.isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handlePointerUp();

    domElem.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElem.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 7. Loop de Cinemática Biomecânica 3D (60fps)
    let animId: number;
    let clockTime = 0;
    let lastTimestamp = performance.now();

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const resetPose = () => {
      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.set(0, 0, 0);
      pelvisGroup.position.set(0, -0.1, 0);
      pelvisGroup.rotation.set(0, 0, 0);
      spineGroup.rotation.set(0, 0, 0);
      chestGroup.rotation.set(0, 0, 0);

      [leftArm, rightArm].forEach((arm) => {
        arm.shoulderJoint.rotation.set(0, 0, 0);
        arm.elbowJoint.rotation.set(0, 0, 0);
        arm.dumbbellGroup.visible = false;
      });

      [leftLeg, rightLeg].forEach((leg) => {
        leg.hipJoint.rotation.set(0, 0, 0);
        leg.kneeJoint.rotation.set(0, 0, 0);
      });

      barbellGroup.visible = false;
      barbellGroup.position.set(0, 0, 0);
      barbellGroup.rotation.set(0, 0, 0);
      benchGroup.visible = false;
    };

    const animate = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (stateRef.current.isPlaying) {
        clockTime += dt * 2.3 * stateRef.current.speed;
      }

      // Fase suavizada (0 = excêntrica/alongamento, 1 = concêntrica/contração)
      const rawSin = (Math.sin(clockTime) + 1) / 2;
      const phase = rawSin * rawSin * (3 - 2 * rawSin);

      // Pulso luminoso no músculo-alvo durante a contração
      activeMuscleMat.emissiveIntensity = 0.35 + phase * 0.65;

      resetPose();

      const p = stateRef.current.pattern;

      switch (p) {
        // ====================================================================
        // AGACHAMENTO LIVRE / HACK / AFUNDO
        // ====================================================================
        case "squat": {
          const squatDepth = lerp(0, 1, phase);
          pelvisGroup.position.y = lerp(-0.1, -0.48, squatDepth);
          pelvisGroup.position.z = lerp(0, -0.16, squatDepth);
          spineGroup.rotation.x = lerp(0.08, 0.42, squatDepth);

          const hipAngle = lerp(-0.08, -1.35, squatDepth);
          const kneeAngle = lerp(0.1, 1.55, squatDepth);

          leftLeg.hipJoint.rotation.x = hipAngle;
          leftLeg.hipJoint.rotation.z = -0.12;
          rightLeg.hipJoint.rotation.x = hipAngle;
          rightLeg.hipJoint.rotation.z = 0.12;

          leftLeg.kneeJoint.rotation.x = kneeAngle;
          rightLeg.kneeJoint.rotation.x = kneeAngle;

          // Braços segurando a barra no trapézio
          leftArm.shoulderJoint.rotation.z = -0.45;
          leftArm.shoulderJoint.rotation.x = 0.35;
          leftArm.elbowJoint.rotation.x = -2.1;

          rightArm.shoulderJoint.rotation.z = 0.45;
          rightArm.shoulderJoint.rotation.x = 0.35;
          rightArm.elbowJoint.rotation.x = -2.1;

          barbellGroup.visible = true;
          barbellGroup.position.set(
            0,
            pelvisGroup.position.y + 0.62,
            pelvisGroup.position.z + lerp(-0.03, 0.14, squatDepth)
          );
          break;
        }

        // ====================================================================
        // SUPINO RETO / INCLINADO / TESTA (Deitado no banco 3D)
        // ====================================================================
        case "bench_press":
        case "incline_press": {
          benchGroup.visible = true;
          pelvisGroup.position.set(0, -0.3, 0.25);
          pelvisGroup.rotation.x = -Math.PI / 2;
          if (p === "incline_press") {
            spineGroup.rotation.x = 0.38;
          }

          // Pernas dobradas apoiadas no chão ao lado do banco
          leftLeg.hipJoint.rotation.x = 0.45;
          leftLeg.hipJoint.rotation.z = -0.25;
          leftLeg.kneeJoint.rotation.x = 1.35;

          rightLeg.hipJoint.rotation.x = 0.45;
          rightLeg.hipJoint.rotation.z = 0.25;
          rightLeg.kneeJoint.rotation.x = 1.35;

          // Braços empurrando a barra para o teto
          const shoulderOpen = lerp(1.25, 0.35, phase);
          const elbowBend = lerp(-1.55, -0.15, phase);

          leftArm.shoulderJoint.rotation.x = -Math.PI / 2;
          leftArm.shoulderJoint.rotation.y = -shoulderOpen;
          leftArm.elbowJoint.rotation.x = elbowBend;

          rightArm.shoulderJoint.rotation.x = -Math.PI / 2;
          rightArm.shoulderJoint.rotation.y = shoulderOpen;
          rightArm.elbowJoint.rotation.x = elbowBend;

          barbellGroup.visible = true;
          barbellGroup.position.set(0, lerp(0.02, 0.42, phase), -0.22);
          break;
        }

        // ====================================================================
        // LEVANTAMENTO TERRA / STIFF (Hip Hinge 3D)
        // ====================================================================
        case "deadlift": {
          const hinge = lerp(1, 0, phase); // Começa inclinado e sobe estendendo
          pelvisGroup.position.y = lerp(-0.1, -0.22, hinge);
          pelvisGroup.position.z = lerp(0, -0.22, hinge);
          spineGroup.rotation.x = lerp(0.05, 1.15, hinge);

          leftLeg.hipJoint.rotation.x = lerp(-0.05, -0.55, hinge);
          rightLeg.hipJoint.rotation.x = lerp(-0.05, -0.55, hinge);
          leftLeg.kneeJoint.rotation.x = lerp(0.08, 0.45, hinge);
          rightLeg.kneeJoint.rotation.x = lerp(0.08, 0.45, hinge);

          // Braços sempre verticais segurando a barra pesada
          leftArm.shoulderJoint.rotation.x = -lerp(0.05, 1.05, hinge);
          rightArm.shoulderJoint.rotation.x = -lerp(0.05, 1.05, hinge);

          barbellGroup.visible = true;
          barbellGroup.position.set(0, lerp(-0.18, -0.64, hinge), 0.18);
          break;
        }

        // ====================================================================
        // PUXADA ALTA (PULLEY FRENTE)
        // ====================================================================
        case "lat_pulldown": {
          benchGroup.visible = true;
          pelvisGroup.position.set(0, -0.32, 0);
          leftLeg.hipJoint.rotation.x = -1.35;
          rightLeg.hipJoint.rotation.x = -1.35;
          leftLeg.kneeJoint.rotation.x = 1.45;
          rightLeg.kneeJoint.rotation.x = 1.45;

          const pull = phase;
          leftArm.shoulderJoint.rotation.z = lerp(-2.5, -0.75, pull);
          rightArm.shoulderJoint.rotation.z = lerp(2.5, 0.75, pull);
          leftArm.elbowJoint.rotation.x = lerp(-0.2, -1.65, pull);
          rightArm.elbowJoint.rotation.x = lerp(-0.2, -1.65, pull);

          barbellGroup.visible = true;
          barbellGroup.position.set(0, lerp(0.82, 0.34, pull), 0.14);
          break;
        }

        // ====================================================================
        // REMADA SENTADO / CURVADA
        // ====================================================================
        case "seated_row": {
          spineGroup.rotation.x = 0.65;
          pelvisGroup.position.y = -0.18;
          leftLeg.hipJoint.rotation.x = -0.4;
          rightLeg.hipJoint.rotation.x = -0.4;
          leftLeg.kneeJoint.rotation.x = 0.5;
          rightLeg.kneeJoint.rotation.x = 0.5;

          const row = phase;
          leftArm.shoulderJoint.rotation.x = lerp(-0.95, 0.35, row);
          rightArm.shoulderJoint.rotation.x = lerp(-0.95, 0.35, row);
          leftArm.elbowJoint.rotation.x = lerp(-0.2, -1.45, row);
          rightArm.elbowJoint.rotation.x = lerp(-0.2, -1.45, row);

          barbellGroup.visible = true;
          barbellGroup.position.set(
            0,
            lerp(-0.35, 0.02, row),
            lerp(0.45, 0.18, row)
          );
          break;
        }

        // ====================================================================
        // ROSCA DIRETA / ALTERNADA / MARTELO (BÍCEPS 3D)
        // ====================================================================
        case "bicep_curl": {
          leftArm.dumbbellGroup.visible = true;
          rightArm.dumbbellGroup.visible = true;

          const curlAngle = lerp(-0.2, -2.25, phase);
          leftArm.elbowJoint.rotation.x = curlAngle;
          rightArm.elbowJoint.rotation.x = curlAngle;
          break;
        }

        // ====================================================================
        // TRÍCEPS PULLEY / CORDA (EXTENSÃO DE COTOVELO)
        // ====================================================================
        case "tricep_pushdown": {
          spineGroup.rotation.x = 0.15;
          leftArm.dumbbellGroup.visible = true;
          rightArm.dumbbellGroup.visible = true;

          const extAngle = lerp(-1.95, -0.12, phase);
          leftArm.elbowJoint.rotation.x = extAngle;
          rightArm.elbowJoint.rotation.x = extAngle;
          break;
        }

        // ====================================================================
        // DESENVOLVIMENTO DE OMBROS 3D
        // ====================================================================
        case "shoulder_press": {
          leftArm.dumbbellGroup.visible = true;
          rightArm.dumbbellGroup.visible = true;

          const press = phase;
          leftArm.shoulderJoint.rotation.z = lerp(-1.35, -2.75, press);
          rightArm.shoulderJoint.rotation.z = lerp(1.35, 2.75, press);
          leftArm.elbowJoint.rotation.x = lerp(-1.4, -0.2, press);
          rightArm.elbowJoint.rotation.x = lerp(-1.4, -0.2, press);
          break;
        }

        // ====================================================================
        // ELEVAÇÃO LATERAL / CRUCIFIXO
        // ====================================================================
        case "lateral_raise":
        case "chest_fly": {
          leftArm.dumbbellGroup.visible = true;
          rightArm.dumbbellGroup.visible = true;

          const raise = lerp(0.12, 1.52, phase);
          leftArm.shoulderJoint.rotation.z = -raise;
          rightArm.shoulderJoint.rotation.z = raise;
          leftArm.elbowJoint.rotation.x = -0.25;
          rightArm.elbowJoint.rotation.x = -0.25;
          break;
        }

        // ====================================================================
        // LEG PRESS / EXTENSORA / PANTURRILHA / HIP THRUST / CORE
        // ====================================================================
        case "calf_raise": {
          pelvisGroup.position.y = lerp(-0.12, 0.08, phase);
          leftArm.dumbbellGroup.visible = true;
          rightArm.dumbbellGroup.visible = true;
          break;
        }

        case "hip_thrust":
        case "leg_press": {
          benchGroup.visible = true;
          pelvisGroup.position.set(0, lerp(-0.48, -0.18, phase), 0.05);
          pelvisGroup.rotation.x = -Math.PI / 2;
          leftLeg.hipJoint.rotation.x = lerp(-0.9, -0.1, phase);
          rightLeg.hipJoint.rotation.x = lerp(-0.9, -0.1, phase);
          leftLeg.kneeJoint.rotation.x = lerp(1.6, 1.1, phase);
          rightLeg.kneeJoint.rotation.x = lerp(1.6, 1.1, phase);
          barbellGroup.visible = true;
          barbellGroup.position.set(0, pelvisGroup.position.y + 0.14, 0.05);
          break;
        }

        default: {
          // Prancha / Flexão / Abdominal
          pelvisGroup.position.set(0, lerp(-0.25, -0.45, phase), 0);
          pelvisGroup.rotation.x = Math.PI / 2.2;
          leftArm.shoulderJoint.rotation.x = -1.3;
          rightArm.shoulderJoint.rotation.x = -1.3;
          leftArm.elbowJoint.rotation.x = lerp(-0.2, -1.2, phase);
          rightArm.elbowJoint.rotation.x = lerp(-0.2, -1.2, phase);
          break;
        }
      }

      // Atualiza posição orbital da câmera 3D
      const { yaw, pitch, distance } = stateRef.current;
      camera.position.x = distance * Math.sin(yaw) * Math.cos(pitch);
      camera.position.y = distance * Math.sin(pitch);
      camera.position.z = distance * Math.cos(yaw) * Math.cos(pitch);
      camera.lookAt(0, -0.1, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElem.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
    };
  }, [compact]);

  return (
    <div
      ref={mountRef}
      className={`w-full cursor-grab active:cursor-grabbing ${
        compact ? "h-40" : "h-56"
      }`}
      title="Arraste com o mouse ou dedo para girar o boneco 3D em 360°"
    />
  );
};
