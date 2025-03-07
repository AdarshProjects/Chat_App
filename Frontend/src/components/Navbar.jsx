import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import react from "react";
import { Link } from "react-router-dom";
import { useAuthstore } from '../store/useAuthstore';

export default function Navbar() {
  const {logout, authUser} = useAuthstore();

  return (
    <header
      className="bg-base-100 border-b border-base-300  fixed w-full  top-0 z-40 backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center ga-8">
            <Link to="/" className="flex  items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 teext-primary" />
              </div>
              <h1 className="text-lg font-bol">Chatty</h1>
            </Link>
          </div>
          <div className="flex items-center">
          <Link
            to={"/settings"}
            className={`btn btn-sm gap-2 transition-colors`}
          >
            <Settings className="w-4 h-4" />
            <span  className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to={'/profilepic'} className={`btn btn-sm gap-2`}>
                <User className="size-5" />
                <span className="hidden sm:inline"> Profile</span>
              </Link>

              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
          </div>
        </div>

      </div>

    </header>
  )
}
