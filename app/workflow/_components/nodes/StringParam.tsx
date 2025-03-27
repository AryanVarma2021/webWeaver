import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParamProps } from '@/types/appNode';
import { TaskParam } from '@/types/Tasktype';
import { Param } from '@prisma/client/runtime/library';
import React, { useEffect, useId, useState } from 'react'



const StringParam = ({ param, value, updateNodeParamValue }: ParamProps) => {
    const id = useId();
    const [internalState, setInternalState] = useState(value)
    useEffect(()=>{
        setInternalState(value)
        console.log("value and typeof", value, typeof value);
        
    }, [value]);
    return (
        <div className='space-y-1 w-full p-1'>
            <Label htmlFor={id} className=' flex text-xs'>
                {param.name}
                {param.required && (
                    <p className="text-red-400  px-2">*</p>
                )}
            </Label>
            <Input
            className='text-xs '
            onChange={e => setInternalState(e.target.value)}
            onBlur={e => updateNodeParamValue(e.target.value)}
            
            id={id} value={internalState} placeholder='Entyer value here'/>
            {param.helperText &&(
                <p className='text-muted-foreground px-2 '>{param.helperText}</p>
            )}
        </div>
    );
}

export default StringParam;