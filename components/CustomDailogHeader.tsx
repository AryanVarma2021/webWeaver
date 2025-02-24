"use client"

import React from 'react'
import { DialogHeader } from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    title? : string;
    subTitle? : string;
    icon?: LucideIcon;

    iconClassNames?: string;
    titleClassNames?: string;
    subTitleClassNames?: string;
}
const CustomDailogHeader = (props:Props) => {
    const Icon = props.icon;
    const title = props.title;
    const subTitle = props.subTitle;

  return (
    <DialogHeader className='py-6'>
        <DialogTitle asChild>
            <div className="gap-2 mb-2 flex flex-col justify-center items-center">
                { Icon && (<Icon size={30} className={cn("stroke-primary", props.iconClassNames)} /> )}
                {
                    title && (
                        <p className={cn("text-xl text-primary", props.titleClassNames)}>{title}</p>
                    )

                }
                {
                    subTitle && (
                        <p className={cn("text-sm text-muted-foreground", props.subTitleClassNames)}>{subTitle}</p>
                    )

                }
            </div>
        </DialogTitle>
    </DialogHeader>
  )
}

export default CustomDailogHeader