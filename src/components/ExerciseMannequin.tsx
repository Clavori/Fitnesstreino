"use client";

import React, { useEffect, useState } from "react";
import { AnimationPattern, MuscleGroup } from "@/types/fitness";
import { Pause, Play, RotateCcw } from "lucide-react";

interface ExerciseMannequinProps {
  pattern: AnimationPattern;
  muscleGroup: MuscleGroup;
  compact?: boolean;
}

/**
 * Boneco Biomecânico Articulado 2D em Loop Contínuo (SVG + Interpolação Harmônica).
 * Calcula os ângulos articulares (ombro, cotovelo, quadril, joelho, tornozelo e coluna)
 * quadro a quadro em 60fps para demonstrar a execução correta e destacar o músculo-alvo.
 */
export const ExerciseMannequin: React.FC<ExerciseMannequinProps> = ({
  pattern,
  muscleGroup,
  compact = false,
}) => {
  const [phase, setPhase] = useState(0); // 0 a 1 (0 = início/excêntrica, 1 = pico concêntrico)
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 0.5>(1);

  useEffect(() => {
    if (!isPlaying) return;
    let animationFrameId: number;
    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) * 0.0022 * speed;
      // Onda senoidal suavizada (pausa breve no pico de contração e alongamento)
      const rawSin = (Math.sin(elapsed) + 1) / 2;
      const smooth = rawSin * rawSin * (3 - 2 * rawSin);
      setPhase(smooth);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, speed]);

  // Utilitário de interpolação linear
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Cor neon de ativação muscular
  const activeColor = "#CCFF00";
  const secondaryGlow = "#FF5500";
  const bodyStroke = "#94A3B8";
  const jointFill = "#E2E8F0";

  // Renderizadores biomecânicos dedicados por padrão de movimento
  const renderScene = () => {
    switch (pattern) {
      // ======================================================================
      // 1. SUPINO RETO / INCLINADO / TESTA (Deitado no banco empurrando carga)
      // ======================================================================
      case "bench_press":
      case "incline_press": {
        const isIncline = pattern === "incline_press";
        const barY = lerp(112, 66, phase);
        const barX = isIncline ? lerp(138, 128, phase) : 132;
        const elbowX = isIncline ? lerp(146, 134, phase) : lerp(142, 132, phase);
        const elbowY = lerp(142, 96, phase);

        return (
          <g>
            {/* Banco de Supino */}
            <line
              x1="60"
              y1="146"
              x2="230"
              y2="146"
              stroke="#334155"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line x1="85" y1="146" x2="85" y2="195" stroke="#475569" strokeWidth="7" />
            <line x1="205" y1="146" x2="205" y2="195" stroke="#475569" strokeWidth="7" />

            {/* Pernas apoiadas firme no chão */}
            <line
              x1="195"
              y1="136"
              x2="232"
              y2="144"
              stroke={bodyStroke}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <line
              x1="232"
              y1="144"
              x2="238"
              y2="192"
              stroke={bodyStroke}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="234"
              y1="192"
              x2="250"
              y2="192"
              stroke={activeColor}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Tronco no banco (com arco escapular saudável) */}
            <path
              d={
                isIncline
                  ? "M 110 118 Q 152 126 195 136"
                  : "M 108 134 Q 152 124 195 136"
              }
              stroke={bodyStroke}
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
            />

            {/* Destaque Muscular: Peitoral e Tríceps pulsando na contração */}
            <ellipse
              cx={isIncline ? 132 : 135}
              cy={isIncline ? 118 : 126}
              rx={16 + phase * 4}
              ry={9 + phase * 3}
              fill={activeColor}
              opacity={0.45 + phase * 0.45}
            />

            {/* Cabeça */}
            <circle
              cx={isIncline ? 88 : 84}
              cy={isIncline ? 108 : 130}
              r="14"
              fill="#1E293B"
              stroke={jointFill}
              strokeWidth="3"
            />

            {/* Braço e Antebraço */}
            <line
              x1={isIncline ? 116 : 118}
              y1={isIncline ? 120 : 132}
              x2={elbowX}
              y2={elbowY}
              stroke={muscleGroup === "Tríceps" ? activeColor : "#CBD5E1"}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1={elbowX}
              y1={elbowY}
              x2={barX}
              y2={barY}
              stroke="#E2E8F0"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Articulações */}
            <circle cx={isIncline ? 116 : 118} cy={isIncline ? 120 : 132} r="5" fill={activeColor} />
            <circle cx={elbowX} cy={elbowY} r="4.5" fill={jointFill} />

            {/* Barra + Anilhas Olímpicas */}
            <g transform={`translate(${barX}, ${barY})`}>
              <line x1="-26" y1="0" x2="26" y2="0" stroke="#94A3B8" strokeWidth="4" />
              <rect x="-18" y="-16" width="8" height="32" rx="3" fill={activeColor} />
              <rect x="10" y="-16" width="8" height="32" rx="3" fill={activeColor} />
              <circle cx="0" cy="0" r="6" fill={secondaryGlow} />
            </g>

            {/* Vetor guia de trajetória vertical */}
            <line
              x1={barX}
              y1="52"
              x2={barX}
              y2="115"
              stroke={activeColor}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.45"
            />
          </g>
        );
      }

      // ======================================================================
      // 2. AGACHAMENTO LIVRE / HACK / AFUNDO (Cinemática de Quadril + Joelho)
      // ======================================================================
      case "squat": {
        const hipX = lerp(146, 122, phase);
        const hipY = lerp(112, 148, phase);
        const kneeX = lerp(154, 174, phase);
        const kneeY = lerp(152, 150, phase);
        const shoulderX = lerp(148, 138, phase);
        const shoulderY = lerp(64, 96, phase);
        const headX = shoulderX + 4;
        const headY = shoulderY - 20;

        return (
          <g>
            {/* Linha de paralelo (referência biomecânica) */}
            <line
              x1="80"
              y1="150"
              x2="220"
              y2="150"
              stroke={activeColor}
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />

            {/* Canela (Tíbia) e Pé fixo no chão */}
            <line
              x1="156"
              y1="192"
              x2={kneeX}
              y2={kneeY}
              stroke={bodyStroke}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="146"
              y1="194"
              x2="174"
              y2="194"
              stroke={activeColor}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Coxa (Quadríceps + Glúteo ativos em neon) */}
            <line
              x1={kneeX}
              y1={kneeY}
              x2={hipX}
              y2={hipY}
              stroke={activeColor}
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Brilho no Glúteo */}
            <circle
              cx={hipX - 4}
              cy={hipY + 2}
              r={9 + phase * 3}
              fill={secondaryGlow}
              opacity={0.45 + phase * 0.45}
            />

            {/* Tronco neutro e firme */}
            <line
              x1={hipX}
              y1={hipY}
              x2={shoulderX}
              y2={shoulderY}
              stroke="#CBD5E1"
              strokeWidth="15"
              strokeLinecap="round"
            />

            {/* Cabeça olhando para frente */}
            <circle
              cx={headX}
              cy={headY}
              r="13"
              fill="#1E293B"
              stroke={jointFill}
              strokeWidth="3"
            />

            {/* Braço segurando a barra no trapézio */}
            <line
              x1={shoulderX}
              y1={shoulderY}
              x2={shoulderX - 10}
              y2={shoulderY + 22}
              stroke="#94A3B8"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1={shoulderX - 10}
              y1={shoulderY + 22}
              x2={shoulderX - 2}
              y2={shoulderY + 2}
              stroke="#E2E8F0"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Barra Olímpica no Trapézio */}
            <g transform={`translate(${shoulderX - 3}, ${shoulderY + 2})`}>
              <rect x="-12" y="-14" width="24" height="28" rx="5" fill={activeColor} />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
            </g>

            {/* Articulações */}
            <circle cx={hipX} cy={hipY} r="5" fill={jointFill} />
            <circle cx={kneeX} cy={kneeY} r="5" fill={jointFill} />
          </g>
        );
      }

      // ======================================================================
      // 3. PUXADA ALTA / BARRA FIXA (Visão Frontal / Dorsal Ativa)
      // ======================================================================
      case "lat_pulldown": {
        const barY = lerp(42, 92, phase);
        const elbowXLeft = lerp(96, 114, phase);
        const elbowXRight = lerp(204, 186, phase);
        const elbowY = lerp(66, 118, phase);
        const handXLeft = 102;
        const handXRight = 198;

        return (
          <g>
            {/* Estrutura da Polia Superior */}
            <line x1="150" y1="12" x2="150" y2={barY} stroke="#64748B" strokeWidth="3" />
            <rect x="120" y="8" width="60" height="8" rx="4" fill="#334155" />

            {/* Banco e Pernas Travadas */}
            <rect x="122" y="158" width="56" height="10" rx="4" fill="#334155" />
            <line x1="134" y1="162" x2="126" y2="195" stroke={bodyStroke} strokeWidth="10" strokeLinecap="round" />
            <line x1="166" y1="162" x2="174" y2="195" stroke={bodyStroke} strokeWidth="10" strokeLinecap="round" />

            {/* Tronco em V (Grande Dorsal expandindo na contração) */}
            <polygon
              points={`150,158 ${118 - phase * 6},94 ${182 + phase * 6},94`}
              fill={activeColor}
              opacity={0.35 + phase * 0.5}
            />
            <polygon
              points="150,158 128,94 172,94"
              fill="#1E293B"
              stroke="#CBD5E1"
              strokeWidth="3"
            />

            {/* Cabeça */}
            <circle cx="150" cy="74" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Braços Esquerdo e Direito */}
            <line x1="124" y1="96" x2={elbowXLeft} y2={elbowY} stroke={activeColor} strokeWidth="9" strokeLinecap="round" />
            <line x1={elbowXLeft} y1={elbowY} x2={handXLeft} y2={barY} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />

            <line x1="176" y1="96" x2={elbowXRight} y2={elbowY} stroke={activeColor} strokeWidth="9" strokeLinecap="round" />
            <line x1={elbowXRight} y1={elbowY} x2={handXRight} y2={barY} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />

            {/* Barra Longa da Puxada */}
            <path
              d={`M 84 ${barY + 6} L 100 ${barY} L 200 ${barY} L 216 ${barY + 6}`}
              stroke={secondaryGlow}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );
      }

      // ======================================================================
      // 4. REMADA SENTADO / CURVADA / FACE PULL (Retração Escapular)
      // ======================================================================
      case "seated_row": {
        const handX = lerp(196, 146, phase);
        const handY = lerp(118, 122, phase);
        const elbowX = lerp(168, 118, phase);
        const elbowY = lerp(118, 126, phase);

        return (
          <g>
            {/* Banco e Apoio de Pés */}
            <line x1="90" y1="154" x2="225" y2="154" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <line x1="225" y1="120" x2="225" y2="160" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

            {/* Cabo da Polia */}
            <line x1="245" y1="120" x2={handX} y2={handY} stroke="#64748B" strokeWidth="3" strokeDasharray="3 2" />

            {/* Pernas semi-flexionadas apoiadas */}
            <line x1="130" y1="146" x2="175" y2="136" stroke={bodyStroke} strokeWidth="11" strokeLinecap="round" />
            <line x1="175" y1="136" x2="218" y2="144" stroke={bodyStroke} strokeWidth="10" strokeLinecap="round" />

            {/* Tronco ereto 90° */}
            <line x1="130" y1="146" x2="132" y2="86" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" />

            {/* Destaque Muscular nas Costas / Romboides */}
            <ellipse
              cx="124"
              cy="112"
              rx={8 + phase * 4}
              ry={18}
              fill={activeColor}
              opacity={0.45 + phase * 0.5}
            />

            {/* Cabeça */}
            <circle cx="134" cy="64" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Braço e Antebraço puxando */}
            <line x1="132" y1="92" x2={elbowX} y2={elbowY} stroke={activeColor} strokeWidth="10" strokeLinecap="round" />
            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="#E2E8F0" strokeWidth="9" strokeLinecap="round" />

            <circle cx={elbowX} cy={elbowY} r="4.5" fill={jointFill} />
            <polygon
              points={`${handX},${handY - 8} ${handX + 10},${handY} ${handX},${handY + 8}`}
              fill={secondaryGlow}
            />
          </g>
        );
      }

      // ======================================================================
      // 5. LEVANTAMENTO TERRA / STIFF (Hip Hinge - Dobradiça de Quadril)
      // ======================================================================
      case "deadlift": {
        const hipX = lerp(118, 146, phase);
        const hipY = lerp(116, 112, phase);
        const shoulderX = lerp(176, 148, phase);
        const shoulderY = lerp(96, 62, phase);
        const barX = lerp(162, 154, phase);
        const barY = lerp(156, 118, phase);

        return (
          <g>
            {/* Pernas e Posterior de Coxa em destaque */}
            <line x1="152" y1="192" x2="146" y2="152" stroke={bodyStroke} strokeWidth="10" strokeLinecap="round" />
            <line x1="146" y1="152" x2={hipX} y2={hipY} stroke={activeColor} strokeWidth="13" strokeLinecap="round" />
            <line x1="142" y1="194" x2="168" y2="194" stroke={activeColor} strokeWidth="6" strokeLinecap="round" />

            {/* Glúteo e Lombar */}
            <circle cx={hipX - 4} cy={hipY} r={10} fill={secondaryGlow} opacity={0.5 + phase * 0.4} />

            {/* Coluna 100% Reta fazendo Hip Hinge */}
            <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} stroke={activeColor} strokeWidth="15" strokeLinecap="round" />

            {/* Cabeça alinhada com a coluna */}
            <circle
              cx={shoulderX + (shoulderX - hipX) * 0.32}
              cy={shoulderY + (shoulderY - hipY) * 0.32}
              r="13"
              fill="#1E293B"
              stroke={jointFill}
              strokeWidth="3"
            />

            {/* Braço reto segurando a barra rente à canela/coxa */}
            <line x1={shoulderX} y1={shoulderY} x2={barX} y2={barY} stroke="#E2E8F0" strokeWidth="9" strokeLinecap="round" />

            {/* Anilha Olímpica */}
            <circle cx={barX} cy={barY} r="18" fill="#0F172A" stroke={activeColor} strokeWidth="5" />
            <circle cx={barX} cy={barY} r="5" fill={secondaryGlow} />
          </g>
        );
      }

      // ======================================================================
      // 6. LEG PRESS 45° / EXTENSORA / FLEXORA
      // ======================================================================
      case "leg_press": {
        const footX = lerp(176, 212, phase);
        const footY = lerp(102, 66, phase);
        const kneeX = lerp(136, 168, phase);
        const kneeY = lerp(110, 108, phase);

        return (
          <g>
            {/* Assento inclinado do Leg Press */}
            <line x1="78" y1="115" x2="122" y2="158" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
            <line x1="122" y1="158" x2="152" y2="148" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

            {/* Plataforma 45° */}
            <line
              x1={footX - 14}
              y1={footY - 18}
              x2={footX + 14}
              y2={footY + 18}
              stroke={secondaryGlow}
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Tronco e Cabeça apoiados */}
            <line x1="94" y1="114" x2="124" y2="148" stroke="#CBD5E1" strokeWidth="15" strokeLinecap="round" />
            <circle cx="84" cy="96" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Coxa (Quadríceps ativo) e Canela */}
            <line x1="124" y1="148" x2={kneeX} y2={kneeY} stroke={activeColor} strokeWidth="14" strokeLinecap="round" />
            <line x1={kneeX} y1={kneeY} x2={footX} y2={footY} stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />

            <circle cx={kneeX} cy={kneeY} r="5" fill={jointFill} />
          </g>
        );
      }

      // ======================================================================
      // 7. ELEVAÇÃO PÉLVICA (HIP THRUST)
      // ======================================================================
      case "hip_thrust": {
        const hipY = lerp(156, 118, phase);
        return (
          <g>
            {/* Banco de apoio escapular */}
            <rect x="68" y="118" width="38" height="76" rx="6" fill="#334155" />

            {/* Tronco e Coxa subindo até alinhar paralelo ao solo */}
            <line x1="102" y1="118" x2="156" y2={hipY} stroke="#CBD5E1" strokeWidth="15" strokeLinecap="round" />
            <line x1="156" y1={hipY} x2="206" y2="120" stroke={activeColor} strokeWidth="14" strokeLinecap="round" />
            <line x1="206" y1="120" x2="206" y2="192" stroke={bodyStroke} strokeWidth="10" strokeLinecap="round" />
            <line x1="198" y1="192" x2="220" y2="192" stroke={activeColor} strokeWidth="6" strokeLinecap="round" />

            {/* Cabeça com queixo no peito */}
            <circle cx="88" cy="100" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Glúteo e Barra no Quadril */}
            <circle cx="156" cy={hipY + 6} r={11 + phase * 3} fill={activeColor} opacity={0.55 + phase * 0.4} />
            <circle cx="156" cy={hipY - 8} r="14" fill="#0F172A" stroke={secondaryGlow} strokeWidth="4" />
          </g>
        );
      }

      // ======================================================================
      // 8. ROSCA DIRETA / ALTERNADA / MARTELO / SCOTT (Isolamento de Bíceps)
      // ======================================================================
      case "bicep_curl": {
        const angle = lerp(0.35, 2.35, phase); // Flexão do cotovelo
        const elbowX = 148;
        const elbowY = 118;
        const forearmLen = 38;
        const handX = elbowX + Math.sin(angle) * forearmLen;
        const handY = elbowY + Math.cos(angle) * forearmLen;

        return (
          <g>
            {/* Pernas e Tronco fixos (sem roubar com a lombar) */}
            <line x1="142" y1="132" x2="142" y2="192" stroke={bodyStroke} strokeWidth="12" strokeLinecap="round" />
            <line x1="136" y1="192" x2="160" y2="192" stroke={activeColor} strokeWidth="6" strokeLinecap="round" />
            <line x1="142" y1="76" x2="142" y2="132" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" />
            <circle cx="144" cy="54" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Braço colado na lateral do tronco + Pico do Bíceps */}
            <line x1="144" y1="82" x2={elbowX} y2={elbowY} stroke="#94A3B8" strokeWidth="11" strokeLinecap="round" />
            <ellipse
              cx="154"
              cy="100"
              rx={6 + phase * 5}
              ry={11}
              fill={activeColor}
              opacity={0.5 + phase * 0.5}
            />

            {/* Antebraço subindo em arco */}
            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="#E2E8F0" strokeWidth="9" strokeLinecap="round" />
            <circle cx={elbowX} cy={elbowY} r="5" fill={jointFill} />

            {/* Halter / Barra */}
            <g transform={`translate(${handX}, ${handY})`}>
              <rect x="-8" y="-12" width="16" height="24" rx="4" fill={secondaryGlow} />
              <circle cx="0" cy="0" r="5" fill={activeColor} />
            </g>
          </g>
        );
      }

      // ======================================================================
      // 9. TRÍCEPS PULLEY / CORDA / PARALELAS (Extensão de Cotovelo)
      // ======================================================================
      case "tricep_pushdown": {
        const angle = lerp(2.15, 0.25, phase); // Estende para baixo
        const elbowX = 148;
        const elbowY = 114;
        const forearmLen = 38;
        const handX = elbowX + Math.sin(angle) * forearmLen;
        const handY = elbowY + Math.cos(angle) * forearmLen;

        return (
          <g>
            {/* Cabo da Polia Alta */}
            <line x1="192" y1="22" x2={handX} y2={handY} stroke="#64748B" strokeWidth="3" strokeDasharray="3 2" />
            <circle cx="192" cy="22" r="6" fill="#475569" />

            {/* Corpo levemente inclinado e estável */}
            <line x1="136" y1="134" x2="134" y2="192" stroke={bodyStroke} strokeWidth="12" strokeLinecap="round" />
            <line x1="142" y1="76" x2="136" y2="134" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" />
            <circle cx="146" cy="54" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Tríceps brilhando na extensão */}
            <line x1="144" y1="80" x2={elbowX} y2={elbowY} stroke={activeColor} strokeWidth="12" strokeLinecap="round" />
            <ellipse
              cx="138"
              cy="98"
              rx={6 + phase * 4}
              ry={12}
              fill={activeColor}
              opacity={0.45 + phase * 0.55}
            />

            {/* Antebraço estendendo */}
            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="#E2E8F0" strokeWidth="9" strokeLinecap="round" />
            <circle cx={elbowX} cy={elbowY} r="5" fill={jointFill} />
            <circle cx={handX} cy={handY} r="7" fill={secondaryGlow} />
          </g>
        );
      }

      // ======================================================================
      // 10. DESENVOLVIMENTO DE OMBROS / ELEVAÇÃO LATERAL / CRUCIFIXO
      // ======================================================================
      case "shoulder_press":
      case "lateral_raise":
      case "chest_fly": {
        const isPress = pattern === "shoulder_press";
        const isFly = pattern === "chest_fly";

        const elbowY = isPress
          ? lerp(104, 66, phase)
          : isFly
          ? 98
          : lerp(124, 86, phase);
        const elbowXLeft = isPress
          ? lerp(106, 118, phase)
          : isFly
          ? lerp(96, 134, phase)
          : lerp(120, 92, phase);
        const elbowXRight = 300 - elbowXLeft;

        const handY = isPress
          ? lerp(80, 36, phase)
          : isFly
          ? 98
          : lerp(136, 84, phase);
        const handXLeft = isPress
          ? lerp(104, 124, phase)
          : isFly
          ? lerp(82, 142, phase)
          : lerp(116, 74, phase);
        const handXRight = 300 - handXLeft;

        return (
          <g>
            {/* Pernas e Tronco Frontal */}
            <line x1="136" y1="142" x2="132" y2="192" stroke={bodyStroke} strokeWidth="11" strokeLinecap="round" />
            <line x1="164" y1="142" x2="168" y2="192" stroke={bodyStroke} strokeWidth="11" strokeLinecap="round" />
            <polygon points="134,142 166,142 174,84 126,84" fill="#1E293B" stroke="#CBD5E1" strokeWidth="3" />

            {/* Destaque Muscular (Deltoides ou Peitoral) */}
            {isFly ? (
              <ellipse cx="150" cy="102" rx={20} ry={12} fill={activeColor} opacity={0.45 + phase * 0.5} />
            ) : (
              <>
                <circle cx="122" cy="86" r={10 + phase * 3} fill={activeColor} opacity={0.55 + phase * 0.45} />
                <circle cx="178" cy="86" r={10 + phase * 3} fill={activeColor} opacity={0.55 + phase * 0.45} />
              </>
            )}

            {/* Cabeça */}
            <circle cx="150" cy="62" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Braços Simétricos */}
            <line x1="124" y1="86" x2={elbowXLeft} y2={elbowY} stroke="#E2E8F0" strokeWidth="9" strokeLinecap="round" />
            <line x1={elbowXLeft} y1={elbowY} x2={handXLeft} y2={handY} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />

            <line x1="176" y1="86" x2={elbowXRight} y2={elbowY} stroke="#E2E8F0" strokeWidth="9" strokeLinecap="round" />
            <line x1={elbowXRight} y1={elbowY} x2={handXRight} y2={handY} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />

            {/* Halteres */}
            <rect x={handXLeft - 10} y={handY - 5} width="20" height="10" rx="3" fill={secondaryGlow} />
            <rect x={handXRight - 10} y={handY - 5} width="20" height="10" rx="3" fill={secondaryGlow} />
          </g>
        );
      }

      // ======================================================================
      // 11. PANTURRILHA EM PÉ (Flexão Plantar)
      // ======================================================================
      case "calf_raise": {
        const bodyOffsetY = lerp(8, -14, phase);
        return (
          <g>
            {/* Degrau / Plataforma */}
            <rect x="122" y="182" width="44" height="14" rx="3" fill="#334155" />

            <g transform={`translate(0, ${bodyOffsetY})`}>
              <line x1="150" y1="68" x2="150" y2="124" stroke="#CBD5E1" strokeWidth="15" strokeLinecap="round" />
              <circle cx="150" cy="46" r="13" fill="#1E293B" stroke={jointFill} strokeWidth="3" />
              <line x1="150" y1="124" x2="150" y2="156" stroke={bodyStroke} strokeWidth="12" strokeLinecap="round" />
              {/* Gastrocnêmio brilhando */}
              <ellipse cx="144" cy="166" rx={7 + phase * 3} ry="12" fill={activeColor} opacity={0.55 + phase * 0.45} />
              <line x1="150" y1="156" x2="150" y2="182" stroke={activeColor} strokeWidth="10" strokeLinecap="round" />
            </g>

            {/* Pé articulando no degrau */}
            <line
              x1="150"
              y1={182 + bodyOffsetY}
              x2="162"
              y2="182"
              stroke={secondaryGlow}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        );
      }

      // ======================================================================
      // 12. ABDOMINAL / PRANCHA / FLEXÃO DE BRAÇO (Core Ativo)
      // ======================================================================
      case "crunch":
      case "plank":
      case "pushup":
      default: {
        const isPushup = pattern === "pushup";
        const isCrunch = pattern === "crunch";
        const shoulderY = isPushup
          ? lerp(118, 152, phase)
          : isCrunch
          ? lerp(152, 122, phase)
          : 126;
        const hipY = isPushup ? lerp(138, 160, phase) : 148;

        return (
          <g>
            {/* Colchonete */}
            <line x1="56" y1="184" x2="244" y2="184" stroke="#334155" strokeWidth="6" strokeLinecap="round" />

            {/* Pernas */}
            <line
              x1="164"
              y1={hipY}
              x2="218"
              y2={isCrunch ? lerp(146, 118, phase) : 176}
              stroke={bodyStroke}
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Tronco + Core em Neon */}
            <line
              x1="102"
              y1={shoulderY}
              x2="164"
              y2={hipY}
              stroke={activeColor}
              strokeWidth="15"
              strokeLinecap="round"
            />
            <ellipse
              cx="134"
              cy={(shoulderY + hipY) / 2 + 4}
              rx="18"
              ry={7 + phase * 3}
              fill={secondaryGlow}
              opacity={0.5 + phase * 0.45}
            />

            {/* Cabeça */}
            <circle cx="84" cy={shoulderY - 8} r="12" fill="#1E293B" stroke={jointFill} strokeWidth="3" />

            {/* Apoio dos braços */}
            <line
              x1="102"
              y1={shoulderY}
              x2="104"
              y2="178"
              stroke="#E2E8F0"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>
        );
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-[#090E1A] to-slate-950 p-3">
      {/* Grade biomecânica de fundo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(#CCFF00 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header com badge de ativação */}
      <div className="relative z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-neon-lime" />
          <span className="font-semibold uppercase tracking-wider text-neon-lime">
            Foco: {muscleGroup}
          </span>
        </div>
        {!compact && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSpeed(speed === 1 ? 0.5 : 1)}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-200 hover:border-neon-lime/50"
              title="Alternar câmera lenta"
            >
              {speed === 1 ? "1.0x" : "0.5x Slow"}
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-lg border border-slate-700 bg-slate-800/80 p-1.5 text-slate-200 hover:border-neon-lime/50"
              title={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Palco SVG do Boneco Biomecânico */}
      <div className="relative z-10 flex items-center justify-center">
        <svg
          viewBox="0 0 300 210"
          className={compact ? "h-36 w-full max-w-[220px]" : "h-52 w-full max-w-[300px]"}
          aria-label={`Animação biomecânica do grupo muscular ${muscleGroup}`}
        >
          {/* Sombra no chão */}
          <ellipse cx="150" cy="196" rx="85" ry="6" fill="#020617" opacity="0.7" />
          {renderScene()}
        </svg>
      </div>

      {/* Barra inferior de fase do movimento (Excêntrica vs Concêntrica) */}
      {!compact && (
        <div className="relative z-10 mt-1 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
          <span>
            Fase:{" "}
            <strong className="text-white">
              {phase > 0.55
                ? "Contração Máxima (Solte o ar)"
                : "Alongamento Controlado (Inspire)"}
            </strong>
          </span>
          <span className="flex items-center gap-1 text-neon-lime">
            <RotateCcw className="h-3 w-3" /> Loop 60fps
          </span>
        </div>
      )}
    </div>
  );
};
