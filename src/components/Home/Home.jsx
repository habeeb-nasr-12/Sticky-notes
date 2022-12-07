import axios from "axios"
import {useEffect ,useState } from "react"
import {AiFillDelete} from "react-icons/ai"
import {FiEdit2} from "react-icons/fi"
import jwtDecode from "jwt-decode"
import {Navigate} from "react-router-dom"




export function  Home({loggedInUser}){
    let [notes,setNotes]= useState(null)
    let [usernotes,setUserNotes]= useState({title:"",desc:""})
    let [userUpdatednotes,setUserUpdatedNotes]= useState({token:"",title:"",desc:"",NoteID:""})
    let token = localStorage.getItem("token")
    let decoded= jwtDecode(token)
    let userID= decoded._id
     async function getAllNotes(){
            //there is no key and value becuase they have the same key and value 
        let {data} = await axios.post("https://sticky-note-fe.vercel.app/getUserNotes", {token,userID})
       setNotes(data.Notes)
     
      
       
     }

     function getUserNote(e){
        let newNote= {...usernotes}
        let inputvalue =e.target.value
        let propertyName =e.target.id
        newNote[propertyName]=inputvalue
        setUserNotes(newNote)
      

     }
 

     async function addNote(e){
      e.preventDefault()
      let {data} = await axios.post("https://sticky-note-fe.vercel.app/addNote",{
        title:usernotes.title,
        desc:usernotes.desc,
        token,
        citizenID:userID})
      if (data.message=="success"){
        document.getElementById("add-form").reset()
        getAllNotes()
      }
      
     }


     async function delteNote(NoteID){

        let {data} = await axios.delete( "https://sticky-note-fe.vercel.app/deleteNote",{
            data:{
                NoteID,
                token
            }
        }
            )
            
       

        if (data.message =='deleted'){
            getAllNotes()
        }
     }





function getnoteId(index){
    document.querySelector("#exampleModal1 input").value=notes[index].title
    document.querySelector("#exampleModal1 textarea").value=notes[index].desc
   let newNote= {...userUpdatednotes}
    newNote.token= token
    newNote.title=notes[index].title
    newNote.desc=notes[index].desc
    newNote.NoteID=notes[index]._id
    setUserUpdatedNotes(newNote)

   


}

async function  updateNote(e){
    e.preventDefault()
    
    let {data} = await axios.put( "https://sticky-note-fe.vercel.app/updateNote",{
        token:token,
        title:userUpdatednotes.title,
        desc:userUpdatednotes.desc,
        NoteID:userUpdatednotes.NoteID
    })
    if (data.message=="updated"){
        getAllNotes()
    }
    console.log(data)
    }
    


function getNote(e){
setUserUpdatedNotes({...userUpdatednotes,[e.target.id]:e.target.value})
}


     
useEffect(function(){

    getAllNotes()
})
    return<>
    
    
    <h2 className="text-center py-2 ">Hello ,{decoded.first_name}</h2>
    <button type="button " className="btn btn-outline-info position-fixed end-0 m-2 top-25" data-bs-toggle="modal" data-bs-target="#exampleModal">
  add note
</button>


<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">add note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
    <form id="add-form" onSubmit={addNote} >


        <input type="text" onChange={getUserNote} id="title" maxLength="10" className="title form-control my-3 " placeholder="Type title"   />
        <textarea type="text" onChange={getUserNote} id="desc" className="desc form-control my-3 " rows="10" cols="10" placeholder="Type Note"   />
    

        <button type="button" className=" float-end btn mx-2 btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit"  className=" float-end btn btn-primary">Save Note</button>
  
    </form>
      
      
        
        </div>
    </div>
  </div>
</div>

<div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">add note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
    <form id="update-form" onSubmit={updateNote} >


        <input type="text" onChange={getNote} id="title" maxLength="10" className="title form-control my-3 " placeholder="Type edited title"   />
        <textarea type="text" onChange={getNote} id="desc" className="desc form-control my-3 " rows="10" cols="10" placeholder="Type edited Note"   />
    

        <button type="button" className=" float-end btn mx-2 btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit"  className=" float-end btn btn-primary">Update Note</button>
  
    </form>
      
      
        
        </div>
    </div>
  </div>
</div>



















    <div className="container  py-5">

  



    <div className="row g-4 ">
    {notes?.map(function(note,idx){ return<>
        <div  key={note._id} className="col-md-4  ">
          <div className="item rounded note p-4">
          <div className="row">
           <h3    id={note._id} className="my-4 col-md-8  note-title" >{note.title}</h3>
            <span onClick={ ()=> { delteNote(note._id)}} className="del  col-md-2  "><AiFillDelete/></span>
            <span  onClick={()=> {getnoteId(idx)}}  data-bs-toggle="modal"  data-bs-target="#exampleModal1" className="edit col-md-2  "> <FiEdit2/> </span>
           </div>
            
            <p name={note._id} > {note.desc}</p>
          </div>

        </div>
    </>
       
    })}
    </div>
    </div>
    



    


    </>
}
