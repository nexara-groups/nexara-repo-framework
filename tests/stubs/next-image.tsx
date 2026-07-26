import type { ImgHTMLAttributes } from "react";

type StubProps = ImgHTMLAttributes<HTMLImageElement> & {
  readonly src: string;
  readonly alt: string;
  readonly priority?: boolean;
  readonly fill?: boolean;
};

export default function Image({ priority: _priority, fill: _fill, ...rest }: StubProps) {
  return <img {...rest} />;
}
