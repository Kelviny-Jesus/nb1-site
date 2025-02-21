interface ProgressBarProps {
  steps: string[]
  currentStep: number
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-12 px-4">
      <div className="relative flex justify-between items-center">
        {/* Progress line background */}
        <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-gray-800" />

        {/* Active progress line */}
        <div
          className="absolute left-0 top-1/2 h-[1px] -translate-y-1/2 bg-[#4F46E5] transition-all duration-300"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center">
            <div
              className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-xl font-medium transition-all duration-300
                ${index <= currentStep ? "bg-[#4F46E5] text-white" : "bg-[#1e2532] text-gray-400"}`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-3 text-sm font-medium transition-all duration-300
                ${index <= currentStep ? "text-[#4F46E5]" : "text-gray-500"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

