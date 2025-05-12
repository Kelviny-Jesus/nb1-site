interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-12 px-4">
      <div className="relative flex justify-between items-center">
        {/* Progress line background - ajustado para não passar pelas bolas */}
        <div className="absolute left-[7%] top-[34%] h-[2px] w-[86%] -translate-y-1/2 bg-gray-800" />

        {/* Active progress line - com animação mais suave e duração maior */}
        <div
          className="absolute left-[7%] top-[34%] h-[2px] -translate-y-1/2 bg-[#4F46E5] transition-all duration-1000 ease-in-out"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 86}%`,
          }}
        />

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center">
            <div
              className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-xl font-medium transition-all duration-700 ease-in-out
                ${
                  index <= currentStep
                    ? "bg-[#4F46E5] text-white"
                    : "bg-[#1e2532] text-gray-400"
                }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-3 text-sm font-medium transition-all duration-700 ease-in-out
                ${index <= currentStep ? "text-[#4F46E5]" : "text-gray-500"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
