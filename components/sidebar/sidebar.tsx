import Logo from "../ui/logo";
import { MAIN_NAV } from "./nav-item";
import SidebarNav from "./sidebar-nav";


export default function SideBar(){
    return (
        <aside className="hidden md:flex md:w-72 md:flex-col shrink-0 border-r border-neutral-200 bg-white/90 backdrop-blur">
                 <div className="px-4 py-4">
        <Logo />
      </div> 
      <SidebarNav items={MAIN_NAV} />         {/* ✅ pass items */}
        </aside>
    )
}