interface TeamCardProps {
  name: string
  role: string
  education: string
  imageSrc: string
}

export default function TeamCard({ name, role, education, imageSrc }: TeamCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
      <div className="w-32 h-40 rounded-lg overflow-hidden mb-4 border-2 border-gray-100 shadow-sm">
        <img src={imageSrc || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{role}</p>
      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{education}</p>
    </div>
  )
}
