import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

export type CategoryItem = {
  _id: string;
  value: number;
};

type Props = {
  data?: CategoryItem[];
};

export default function RadarVariant({ data }: Props) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <RadarChart cx='50%' cy='50%' outerRadius='50%' data={data}>
        <PolarGrid />
        <PolarAngleAxis style={{ fontSize: '12px' }} dataKey='_id' />
        <PolarRadiusAxis style={{ fontSize: '12px' }} />
        <Radar
          dataKey='value'
          stroke='#3b82f6'
          fill='#3b82f6'
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
