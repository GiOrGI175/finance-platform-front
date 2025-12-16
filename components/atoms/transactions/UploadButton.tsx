import { Upload } from 'lucide-react';
import { useCSVReader } from 'react-papaparse';
import { Button } from '@/components/ui/button';

type Props = {
  onUpload: (result: any) => void;
};

export default function UploadButton({ onUpload }: Props) {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button size='sm' className='w-full sm:w-auto' {...getRootProps()}>
          <Upload className='size-4 mr-2' />
          import
        </Button>
      )}
    </CSVReader>
  );
}
