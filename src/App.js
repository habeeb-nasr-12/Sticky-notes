import logo from './logo.svg';
import './App.css';
import { createBrowserRouter,RouterProvider ,Navigate ,createHashRouter} from "react-router-dom"
import { Home } from './components/Home/Home';
import { Login } from './components/Login/login';
import { Register } from './components/Register/Register';
import { Main } from './components/Main/Main';

import jwtDecode from 'jwt-decode';
import { useState ,useEffect} from 'react';
 



function App(){
  
  let [loggedInUser,setloggedInUser] = useState(null)



function getUserData(){
  if (localStorage.getItem("token") != null){
    let token = localStorage.getItem("token")
    let userData= jwtDecode(token)

    setloggedInUser(userData)
  }
}

function logout(){
  setloggedInUser(null)
  localStorage.removeItem("token")

}

function checkReload(){
  if (localStorage.getItem("token")!= null && loggedInUser==null){

getUserData()

  }
}

useEffect(
  function(){
    checkReload()
  }
,[])

// function ProtectedRoute(props){

//   if (loggedInUser==null){
    
//     return <Navigate to={"/login"} />
 
   
//   }
//   else{
    
//     return <> {props.children} </>
//   }
// }
function ProtectedRoute(props){

  if (localStorage.getItem('token') == null ){
    return <Navigate to={"/login"} />
  }
  else{
    
  return <> { props.children }</>
  
  }
  
  
  
  }



  const routes= createHashRouter([
    {path : "", element: <Main logout={logout} loggedInUser={loggedInUser} /> ,children :[
  
      { path: "", element: <ProtectedRoute> <Home/> </ProtectedRoute>},
      { path: "/home", element: <ProtectedRoute> <Home loggedInUser={loggedInUser} /> </ProtectedRoute>},
      { path: "/Login", element: <Login  userData={getUserData} /> },
      { path: "/Register", element: <Register/> },
      { path: "*", element: <h1 className='text-center'> 4 0 4 Erorr ,page not found </h1> },
      
  
  
    ]}
  ])









  return <>

  <RouterProvider router={routes} />
 
  
  </>
  
  
 
 
 
 
}

export default App;


