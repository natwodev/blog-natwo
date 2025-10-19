import { SiJavascript, SiTypescript, SiReact, SiTailwindcss, SiThreedotjs, SiGithub, SiGit, SiGitlab, SiC, SiCplusplus, SiPython, SiDotnet, SiFlutter, SiDart, SiRedis, SiRabbitmq, SiBlazor, SiDocker } from 'react-icons/si'
import { FiCpu, FiDatabase, FiGitBranch, FiGrid, FiLayers, FiServer, FiTag, FiShield, FiTerminal, FiLayout, FiBox } from 'react-icons/fi'

function getIconForSkill(name: string): React.ReactElement {
  const key = name.toLowerCase()
  if (key === 'javascript') return <SiJavascript />
  if (key === 'typescript') return <SiTypescript />
  if (key === 'react') return <SiReact />
  if (key === 'tailwind css' || key === 'tailwindcss') return <SiTailwindcss />
  if (key === 'three.js' || key === 'threejs') return <SiThreedotjs />
  if (key === 'github') return <SiGithub />
  if (key === 'git') return <SiGit />
  if (key === 'gitlab') return <SiGitlab />
  if (key === 'c') return <SiC />
  if (key === 'c++') return <SiCplusplus />
  if (key === 'python') return <SiPython />
  if (key === 'c#' || key === 'csharp' || key === 'c sharp') return <SiC />
  if (key === '.net' || key === 'dotnet') return <SiDotnet />
  if (key === 'flutter') return <SiFlutter />
  if (key === 'dart') return <SiDart />
  if (key === 'blazor') return <SiBlazor />
  if (key === 'redis') return <SiRedis />
  if (key === 'rabbitmq') return <SiRabbitmq />
  if (key === 'docker') return <SiDocker />
  if (key === 'sql server' || key === 'microsoft sql server') return <FiDatabase />
  if (key === 'winforms' || key === 'windows forms') return <FiLayout />
  if (key === 'devexpress') return <FiBox />
  if (key === 'aes encryption' || key.includes('encryption')) return <FiShield />
  if (key === 'c2/reverse shell' || key.includes('reverse shell')) return <FiTerminal />
  if (key === 'networking') return <FiServer />

  // broad topics
  if (key.includes('database')) return <FiDatabase />
  if (key.includes('network')) return <FiServer />
  if (key.includes('algorithm')) return <FiGrid />
  if (key.includes('data structure')) return <FiLayers />
  if (key.includes('operating system')) return <FiCpu />
  if (key.includes('graph')) return <FiGitBranch />

  return <FiTag />
}

export default function SkillBadge({ name }: { readonly name: string }) {
  return (
    <span className="inline-flex items-center gap-2 leading-none px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm max-w-full">
      <span className="text-brand-cyan/90 text-base flex-shrink-0">
        {getIconForSkill(name)}
      </span>
      <span className="truncate">{name}</span>
    </span>
  )
}


