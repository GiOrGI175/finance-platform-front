import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { object } from 'zod';

type Props = {
  columnIndex: number;
  selectedColums: Record<string, string | null>;
  onchange: (coulmnIndex: number, value: string | null) => void;
};

const options = ['amount', 'payee', 'notes', 'date'];

export default function TabletSelect({
  columnIndex,
  selectedColums,
  onchange,
}: Props) {
  const currentSelect = selectedColums[`column_${columnIndex}`];

  return (
    <Select
      value={currentSelect || ''}
      onValueChange={(value) => onchange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          'focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
          currentSelect && 'text-blue-500'
        )}
      >
        <SelectValue placeholder='skip' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='skip'>Skip</SelectItem>
        {options.map((option, index) => {
          const disabled =
            Object.values(selectedColums).includes(option) &&
            selectedColums[`column_${columnIndex}`] !== option;

          return (
            <SelectItem
              key={index}
              value={option}
              disabled={disabled}
              className='capitalize'
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
