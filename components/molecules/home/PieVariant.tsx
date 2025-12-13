import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatPercentage } from '@/lib/utils';
import CategoryToolTip from '@/components/atoms/home/CategoryToolTip';

const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354'];

export type CategoryItem = {
  _id: string;
  value: number;
};

type Props = {
  data?: CategoryItem[];
};

export default function PieVariant({ data = [] }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width='100%' height={350}>
      <PieChart>
        <Legend
          verticalAlign='bottom'
          align='right'
          content={({ payload }: any) => (
            <ul className='flex flex-col space-y-2'>
              {payload.map((entry: any, index: number) => {
                const percent = total ? (entry.payload.value / total) * 100 : 0;

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
                      {formatPercentage(percent)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        />
        <Tooltip content={<CategoryToolTip />} />
        <Pie
          data={data}
          dataKey='value'
          nameKey='_id'
          cx='50%'
          cy='50%'
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
