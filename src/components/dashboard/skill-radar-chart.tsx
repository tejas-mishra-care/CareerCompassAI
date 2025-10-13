'use client';

import * as React from 'react';
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Skill } from '@/lib/types';

interface SkillRadarChartProps {
    skills: Skill[];
}

export function SkillRadarChart({ skills }: SkillRadarChartProps) {

  const chartData = skills.slice(0, 6).map(skill => ({
    subject: skill.name,
    A: skill.proficiency,
    fullMark: 100,
  }));
  
  const chartConfig = {
    proficiency: {
      label: 'Proficiency',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadarChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <PolarAngleAxis dataKey="subject" />
        <PolarGrid />
        <Radar
          name="Proficiency"
          dataKey="A"
          stroke="hsl(var(--chart-1))"
          fill="hsl(var(--chart-1))"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ChartContainer>
  );
}
// Updated
