import { Loader2 } from "lucide-react";
import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Loader(props: Props) {
  return (
    <div {...props} className={`flex items-center justify-center p-8 transition-all duration-300 flex-col ${props.className}`}>
      <Loader2 className='animate-spin' />
      <p className='text-xl font-semibold tracking-wider mt-3'>Loading...</p>
    </div>
  );
}
