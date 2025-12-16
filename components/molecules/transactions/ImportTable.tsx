import TabletSelect from '@/components/atoms/transactions/TabletSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {
  headers: string[];
  body: string[][];
  selectedColums: Record<string, string | null>;
  ontableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

export default function ImportTable({
  headers,
  body,
  selectedColums,
  ontableHeadSelectChange,
}: Props) {
  return (
    <div className='rounded-md border overflow-hidden'>
      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            {headers.map((_item, index) => (
              <TableHead key={index}>
                <TabletSelect
                  columnIndex={index}
                  selectedColums={selectedColums}
                  onchange={ontableHeadSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row: string[], index) => (
            <TableRow key={index}>
              {row.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
