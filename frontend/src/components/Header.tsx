import { Home, HopOff, User, Wallet } from "lucide-react"

const navData = [
  {
    name: 'Home',
    icon: Home,  
  },
  {
    name: "Rewards",
    icon: HopOff,
  },
  {
    name:"User",
    icon: User
  },
  {
    name: "Wallet",
    icon: Wallet
  }
]
const Header = () => {
  
  return (
    <div className="max-w-3xl mx-auto w-full md:rounded-full p-4 backdrop-blur-sm flex items-center justify-center md:justify-between text-white bg-white/10">
        <h1 className="hidden md:flex bg-transparent">Logo</h1>
        <nav className="flex justify-between space-x-10 w-full md:w-auto">
          {navData.map(({name, icon: Icon}) => (
            <div className="flex flex-col items-center" key={name}>
              <Icon className="size-6" />
              <span className="text-sm font-bold md:hidden">{name}</span>
            </div>
          ))}
        </nav>
        <div className="hidden md:flex bg-transparent">wallet</div>
    </div>
  )
}

export default Header