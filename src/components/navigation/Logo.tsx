import { Leaf } from 'lucide-react';
import type { SVGProps } from 'react';

interface LogoProps extends SVGProps<SVGSVGElement> {
  iconOnly?: boolean;
}

export function Logo({ iconOnly = false, ...props }: LogoProps) {
  return (
    <div className="flex items-center gap-2" aria-label="DiaDoc Logo">
      <Leaf className="h-6 w-6 text-primary" {...props} />
      {!iconOnly && (
        <h1 className="text-xl font-bold text-foreground">
          DiaDoc
        </h1>
      )}
    </div>
  );
}
