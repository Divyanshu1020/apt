import { Search } from 'lucide-react'

export default function SearchBox() {
  return (
    <div className="  border w-full my-2 rounded-2xl flex items-center gap-2 px-4 py-2 bg-slate-100 ">
    <Search size={20} color="#9CA3AF" />
    <input
      type="text"
      placeholder="Search"
      className="w-full border-none  focus:outline-none bg-transparent "
    />
  </div>
  )
}
