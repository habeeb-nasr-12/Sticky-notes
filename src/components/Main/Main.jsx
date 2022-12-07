import { NavBar } from "../Navbar/Navbar";
import {Outlet} from "react-router-dom"
 
 
 
 
export function  Main({loggedInUser,logout}){





    return<>
<NavBar  logout={logout}    loggedInUser={loggedInUser} />

<Outlet/>
    
    
    </>
}