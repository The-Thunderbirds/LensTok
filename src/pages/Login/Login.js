import React, { useEffect, useState } from "react";
import './Login.scss';
function Login() {
  const [file , setFile] = useState('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');
  const [lensHandle , setLensHandle] = useState('lenshandle');
  const photoUpload = e =>{
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setFile(reader.result);
    }
    reader.readAsDataURL(file);
  }
  const editName = e =>{
    const name = e.target.value;
    this.setState({
      name,
    });
  }
  
  const handleSubmit= e =>{
    e.preventDefault();
    let activeP = this.state.active === 'edit' ? 'profile' : 'edit';
    this.setState({
      active: activeP,
    })
  }
  return (
    
    <div className="login-body">
        <div className="card">
    <form className="frm" onSubmit={handleSubmit}>
      <h2>Create Profile</h2>
      <label htmlFor="photo-upload" className="lbl custom-file-upload fas">
    <div className="img-wrap img-upload" >
      <img className="image" for="photo-upload" src={file}/>
    </div>
    <input className="inpt" id="photo-upload" type="file" onChange={photoUpload}/> 
  </label>
  <div className="field">
    <label htmlFor="name">
      Lens Handle:
    </label>
    <input className="inpt" 
      id="name" 
      type="text" 
      onChange={editName} 
      maxlength="25" 
      placeholder="Your Lens Handle" 
      required/>
  </div>
      <button type="submit" className="btn save">Create </button>
    </form>
  </div>
  </div>
  );
}
export default Login;