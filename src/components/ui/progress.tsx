import { memo } from "react"

const progressStyles = {
  base: "relative h-2 w-full overflow-hidden rounded-full bg-orange-100",
  indicator: "h-full w-full flex-1 bg-orange-500 transition-all"
}

interface ProgressProps {
  value?: number
  className?: string
  indicatorClassName?: string
}

const Progress = memo(({
  value = 0,
  className,
  indicatorClassName
}: ProgressProps) => {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={className || progressStyles.base}
    >
      <div
        className={indicatorClassName || progressStyles.indicator}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`
        }}
      />
    </div>
  )
})

Progress.displayName = "Progress"

export { Progress } 