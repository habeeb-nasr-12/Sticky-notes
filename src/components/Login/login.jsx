import {useState} from "react"
import joi from "joi"
import axios from "axios"
import {useNavigate} from "react-router-dom"

export function  Login({userData}){
let navigate =useNavigate()
let [apierror,setApiError]= useState(undefined)

    let [user,setUser]= useState({
        email:"",
        password:"",
    })
    let [joierrors,setjoierrors] =useState([])
    let [loading, setloading]= useState(false)







    
function getUser(e){
    setjoierrors(null)
    setApiError(undefined)

    let inputValue= e.target.value
    let propertyName= e.target.id
    let NewUser= {...user}
    NewUser[propertyName]=inputValue
    setUser(NewUser)
}
function setValidate(e){
      e.preventDefault()
      setloading(true)
      let schema=joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password:joi.string().alphanum().min(3).max(12).required(),


      })

 let joiResponse= schema.validate(user,{abortEarly:false})

      if (joiResponse.error !=undefined){
        setjoierrors(joiResponse.error.details)
        setloading(false)

    
      }
      else{
         CheckUserData()



      }





      async function CheckUserData(){
        let {data} = await axios.post("https://sticky-note-fe.vercel.app/signin",user)
        if (data.message=="success"){ 
           localStorage.setItem("token",data.token)
             navigate("/Home")

            userData()
        }
        else{
        setloading(false)
            setApiError(data.message)
        }
      
       }
















}
 function getSpecificError(key){
    
   if (joierrors!=null){
    for(let i=0 ;i<joierrors.length;i++){
        if(joierrors[i].context.key==key){


            return joierrors[i].message
        }
    }
    return ""
   }

 }




    return<>
        <div className="container w-50 py-5">
    
    <form onSubmit={setValidate} >
<h3 className="mb-5">Login form</h3>




<label htmlFor="email mt-3">Email</label>
<input type="email" onChange={getUser} id="email" className=" form-control my-3" placeholder="email"/>
{getSpecificError('email')? <div className="alert alert-danger "> {getSpecificError('email')}</div>: ''}
{apierror== undefined?'' : <div className="alert alert-danger my-2">{apierror}</div>}

<label htmlFor="password">password </label>
<input type="password" onChange={getUser} id="password" className=" form-control my-3" placeholder="password "/>
{getSpecificError('password')? <div className="alert alert-danger ">{getSpecificError('password')}</div>: ''}
<button  className="btn btn-outline-info "> {loading==false? "log in": <i className="fa-solid fa-spinner fa-spin"></i>}    </button>

{/* {sendUserResponse== undefined?"" : <div className="alert alert-danger my-2">{sendUserResponse}</div>} */}


{/*< i className="fa-solid fa-spinner fa-spin"></i> */}




    </form>
</div>

    
    
    </>
}