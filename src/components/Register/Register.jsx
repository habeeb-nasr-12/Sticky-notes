import {useState} from "react"
import joi from "joi"
import {useNavigate} from "react-router-dom"
import axios from "axios"

export function  Register(){
    let [apierror,setApiError]= useState(undefined)
    let navigate =useNavigate()
    let [user,setUser]= useState({
        first_name:"",
        last_name:"",
        email:"",
        age:0,
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
        first_name: joi.string().alphanum().min(3).max(12).required(),
        last_name: joi.string().alphanum().min(3).max(12).required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        age:joi.number().min(15).max(80).required(),
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


}

    
async function CheckUserData(){
    let {data} = await axios.post("https://sticky-note-fe.vercel.app/signup",user)
    if (data.message=="success"){ 
        navigate("/login")
    }
    else{
    setloading(false)
        setApiError(data.message)
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

<form onSubmit={setValidate}>
<h3 className="mb-4">Registration form</h3>




<label htmlFor="first_name">first_name</label>
<input  type="text" onChange={getUser} id="first_name" className=" form-control  my-3" placeholder="first_name"/>

{getSpecificError('first_name')? <div className="alert alert-danger "> {getSpecificError('first_name')}</div>: ''}
<label htmlFor="last_name">last_name</label>
<input type="text" onChange={getUser} id="last_name" className=" form-control my-3" placeholder="last_name"/>
{getSpecificError('last_name')? <div className="alert alert-danger "> {getSpecificError('last_name')}</div>: ''}

<label htmlFor="email">Email</label>
<input type="email" onChange={getUser} id="email" className=" form-control my-3" placeholder="email"/>
{getSpecificError('email')? <div className="alert alert-danger "> {getSpecificError('email')}</div>: ''}

{apierror== undefined?'' : <div className="alert alert-danger my-2">{apierror}</div>}

<label htmlFor="age">age </label>
<input type="number" onChange={getUser} id="age" className=" form-control my-3" placeholder="age "/>
{getSpecificError('age')? <div className="alert alert-danger "> {getSpecificError('age')}</div>: ''}


<label htmlFor="password">password </label>
<input type="password" onChange={getUser} id="password" className=" form-control my-3" placeholder="password "/>
{getSpecificError('password')? <div className="alert alert-danger ">password must be from 6-20 characters and numbers only </div>: ''}


<button  className="btn btn-outline-info "> {loading==false? "Register": <i className="fa-solid fa-spinner fa-spin"></i>}    </button>




</form>
</div>
    
    
    </>
}