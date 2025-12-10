import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { IconType } from 'react-icons';
import { CountUp } from '../../atoms/home/CountUp';
import { Skeleton } from '@/components/ui/skeleton';

const boxVariant = cva('rounded-md p-3', {
  variants: {
    variant: {
      default: 'bg-blue-500/20',
      success: 'bg-emerald-500/20',
      danger: 'bg-rose-500/20',
      warring: 'bg-yellow-500/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const iconStyleVariant = cva('size-6', {
  variants: {
    variant: {
      default: 'fill-blue-500',
      success: 'fill-emerald-500',
      danger: 'fill-rose-500',
      warring: 'fill-yellow-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconStyleVariant = VariantProps<typeof iconStyleVariant>;

interface DataCardProps extends BoxVariants, IconStyleVariant {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  precentageChange?: number;
  loading: boolean;
}

export default function DataCard({
  icon: Icon,
  title,
  value = 0,
  dateRange,
  precentageChange,
  variant,
  loading,
}: DataCardProps) {
  return (
    <>
      {loading ? (
        <Card className='border-none drop-shadow-sm h-48'>
          <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-4 w-40' />
            </div>
            <Skeleton className='size-12' />
          </CardHeader>

          <CardContent>
            <Skeleton className='h-10 w-24 mb-2' />
            <Skeleton className='h-4 w-40' />
          </CardContent>
        </Card>
      ) : (
        <Card className='border-none drop-shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
            <div className='space-y-2'>
              <CardTitle className='text-2xl line-clamp-1'>{title}</CardTitle>
              <CardDescription className='line-clamp-1'>
                {dateRange}
              </CardDescription>
            </div>

            <div className={cn('shrink-0', boxVariant({ variant }))}>
              <Icon className={cn(iconStyleVariant({ variant }))} />
            </div>
          </CardHeader>

          <CardContent>
            <h1 className='font-bold text-2xl mb-2 line-clamp-1 break-all'>
              <CountUp
                preserveValue
                start={0}
                end={value}
                decimals={2}
                decimalPlaces={2}
                formattingFn={formatCurrency}
              />
            </h1>

            <p
              className={cn(
                'text-muted-foreground text-sm line-clamp-1',
                (precentageChange ?? 0) > 0 && 'text-emerald-500',
                (precentageChange ?? 0) < 0 && 'text-rose-500'
              )}
            >
              {formatPercentage(precentageChange ?? 0)} from last period
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
