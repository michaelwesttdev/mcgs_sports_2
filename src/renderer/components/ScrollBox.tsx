import React, { CSSProperties } from 'react'
import { ScrollArea } from './ui/scroll-area'

type Props = {
    children?:React.ReactNode,
    className?:string,
    ref?:React.Ref<HTMLDivElement>
}

export default function ScrollBox({children,className,ref}: Props) {
  return (
    <ScrollArea ref={ref} className={`${className} pr-4`}>{children}</ScrollArea>
  )
}