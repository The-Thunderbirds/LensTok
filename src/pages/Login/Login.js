import React, { useState } from "react";
import './Login.scss';

import { useApolloProvider } from "~/context/ApolloContext";

import { Web3Storage } from 'web3.storage'

function Login() {
	const { createProfile } = useApolloProvider();

  const [file , setFile] = useState('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');
  const [fileUrl , setFileUrl] = useState('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');
	const [handle, setHandle] = useState("");

	async function createProfileRequest(ipfsUrl) {

    let createProfileRequestObj = {
			handle,
			profilePictureUri: ipfsUrl,
			followNFTURI: null,
			followModule: null
		};

		let response = await createProfile(createProfileRequestObj);
		if(response?.data?.createProfile?.reason === "HANDLE_TAKEN") {
			alert("Handle is already taken. Please try another handle");
		}
		else {
			alert("Profile created successfully");
		}
	}


  const photoUpload = e =>{
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    const pfpFile = new File([file], "pfp.png");
    setFileUrl(pfpFile);

    reader.onloadend = () => {
      setFile(reader.result);
    }
    reader.readAsDataURL(file);
  }
  
  const handleSubmit = async e =>{
    e.preventDefault();

    const cid = await storeFiles([fileUrl]);
    const url = `https://${cid}.ipfs.w3s.link/pfp.png`
    await createProfileRequest(url);  
  }


  async function storeFiles (files) {
    const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE })
    const cid = await client.put(files)
    return cid
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
      onChange={(e) => setHandle(e.target.value)}
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