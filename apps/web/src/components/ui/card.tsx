import cx from "classnames";
type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cx("rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl", className)} {...props} />;
}
export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cx("p-5", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cx("px-5 pb-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx("text-base font-semibold tracking-tight", className)} {...props} />;
}
