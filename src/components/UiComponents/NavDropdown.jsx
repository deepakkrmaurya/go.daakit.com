import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"
import { MdOutlineCurrencyRupee } from "react-icons/md"
import { User } from "lucide-react"
const baseURL = import.meta.env.VITE_BASE_URL;

export function DropdownMenuDemo({ profile, decoded, handleLogout, UserRoles }) {
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-sm bg-gray-100 dark:bg-neutral-800 transition cursor-pointer">
          {profile?.profile_image ? (
            <img src={`${baseURL}/${profile.profile_image}`} alt="avatar" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              <User className="h-5 w-5" />
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white/90 dark:bg-neutral-800 backdrop-blur-lg border border-gray-200 rounded-sm shadow-sm  animate-fade-in-down" align="start">
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-1">
          <div className="flex items-center gap-2">
            {profile?.profile_image ? (
              <img src={`${baseURL}/${profile.profile_image}`} alt="avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                <User className="h-5 w-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 dark:text-white">{profile?.name || "User"}</span>
              <span className="text-xs text-gray-500">{decoded?.email}</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
           
          {
            decoded?.usertype !== "admin" && !UserRoles.includes(decoded?.usertype) && (

              decoded?.tech_based === "1" ? (
                <>
                  <DropdownMenuItem>
                    Wallet :  {parseInt(profile?.wallet_balance)}

                  </DropdownMenuItem>
                    <Link
                      to="/techbased_merchant/profile"
                    >
                  <DropdownMenuItem 
                   
                  >
                      Profile
                  </DropdownMenuItem>
                    </Link>

                </>
              ) : decoded?.type === "vendor" ? (
                <>
                  <Link
                    to="/vendor/profile"
                  >
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                  </Link>

                </>
              ) : decoded.user_type == 'dc' ? (
                <>
                <Link
                    to="/dc/profile"
                  >
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                  </Link>
                </>
              ): (  
                <>
                  <DropdownMenuItem>
                    Wallet :  {parseInt(profile?.wallet_balance)}
                  </DropdownMenuItem>
                  <Link
                    to="/merchant/profile"
                  >
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                  </Link>

                </>
              )

            )
          }


        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleLogout(localStorage.getItem("userType"))} className="flex items-center gap-2 text-red-600 hover:bg-red-100 rounded-md px-2 py-1">
            <User className="h-4 w-4" />
            <span>Logout</span>

          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}
