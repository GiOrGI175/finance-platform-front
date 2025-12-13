import {
  Cell,
  RadialBar,
  RadialBarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import CategoryToolTip from '@/components/atoms/home/CategoryToolTip';

const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354'];

export type CategoryItem = {
  _id: string;
  value: number;
};

type Props = {
  data?: CategoryItem[];
};

export default function RadialVariant({ data = [] }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width='100%' height={350}>
      <RadialBarChart
        cx='50%'
        cy='30%'
        barSize={10}
        innerRadius='90%'
        outerRadius='40%'
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))}
      >
        <RadialBar
          label={{
            position: 'insideStart',
            fill: '#fff',
            fontSize: '12px',
          }}
          background
          dataKey='value'
        />
        <Legend
          verticalAlign='bottom'
          align='right'
          content={({ payload }: any) => (
            <ul className='flex flex-col space-y-2'>
              {payload.map((entry: any, index: number) => {
                return (
                  <li key={index} className='flex items-center gap-2'>
                    <span
                      className='size-2 rounded-full'
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className='text-sm text-muted-foreground'>
                      {entry.value}
                    </span>
                    <span className='text-sm font-medium'>
                      {formatCurrency(entry.payload.value)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
