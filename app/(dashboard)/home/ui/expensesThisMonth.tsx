import * as React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export default function ExpensesThisMonth() {
  return (
    <div className='md:flex-1'>
      <h2 className='mb-2'>Expenses this September:</h2>
      <ScrollArea className='h-64 w-full rounded-md border bg-muted'>
        <div className='p-4'>
          {tags.map((tag) => (
            <>
              <div
                key={tag}
                className='text-sm'>
                {tag}
              </div>
              <Separator className='my-2' />
            </>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}