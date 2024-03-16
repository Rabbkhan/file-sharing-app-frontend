import React, { useState } from 'react';
import File from '../assets/file.svg';
import CopyIcon from '../assets/copy-icon.svg';
import axios from 'axios';
// import { Progress } from "@/components/ui/progress"
import { FileUploader } from "react-drag-drop-files";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileURL, setFileURL] = useState('');
  const [showCopyField, setShowCopyField] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  // axios.defaults.baseURL = 'https://file-sharing-app-k60q.onrender.com';

  // console.log(fileURL)
  const fileTypes = ["JPG", "PNG", "GIF", "JPEG", "MP4"];
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);

      
    }
  };

  const handleChange = (file) => {
    setFile(file);
if(file){
  return toast.info('file Selected');
}
  };

  const handleUploadClick = () => {
    if (!file) {
      return toast.warn('no file selected',{ autoClose: 2000 })
    }
  
    const formData = new FormData();
    formData.append('myfile', file);

    axios.post('https://file-sharing-app-k60q.onrender.com/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress((toast.info(`Uploading: ${progress}%`,{ autoClose: 2000 })));

      }

    })
      .then((res) => {


        if (res.status === 200) {
          // console.log(res.data)
          setFileURL(res.data.file); 

          setShowCopyField(true);
          setShowEmailForm(true);

          setTimeout(() => {
            toast.success('File Uploaded');
          }, 3000);
          
        } else {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
      })
      .catch((err) => console.error('Upload failed:', err));
  };

  const handleCopyURL = () => {
    const fileURLField = document.getElementById('fileURL');
    fileURLField.select();
    document.execCommand('copy');
    toast.success('link copied')
    // Optionally, you can provide a visual cue to the user that the URL has been copied.
  };


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      uuid: fileURL.split("/").splice(-1, 1)[0],
      emailTo: emailTo,
      emailFrom: emailFrom,
    };
    try {
      const response = await axios.post('https://file-sharing-app-k60q.onrender.com/api/files/send/', formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      // Assuming the response contains a JSON object
      const data = response.data;
  
      if (data.success) {
        toast.success('Email Sent');
        // setFileURL('');
        setEmailTo("");
        setEmailFrom("");
      } else {
        // Handle other cases where the email wasn't sent successfully
        toast.error('Email sending failed ');
      }
    } catch (error) {
      // Catching Axios errors
      toast.error(error.message);
    }
  };
  

  return (
    <div className="p-4 mx-w-full mx-auto bg-slate-100 px-12 py-10 shadow-lg shadow-slate-600 rounded-md">
      <div className="flex justify-center">
        <div className="flex justify-center">
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} />

        
        </div>

      </div>

      <div className="title mt-4">
        Drop your Files here or,
        <label htmlFor="fileInput" id="browseBtn" className="text-blue-500 cursor-pointer">
          &nbsp; <span className='border-b-2 border-cyan-400'>Browse</span>
          <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} multiple />
        </label>
        <br />
        <button className='bg-blue-600 text-white py-2 px-5 rounded-xl mt-3 hover:bg-blue-900 hover:text-white hover:shadow-md ' onClick={handleUploadClick}>Upload</button>

        <ToastContainer />
      </div>
   
      {showCopyField && (
        <div className="sharing-container mt-4 ">
          <p className="expire">Link expires in 24 hrs</p>
          <div className="input-container border-2 border-gray-600 bg-slate-200 rounded-lg p-4 max-w-96 flex items-center mt-2 ">
            <input type="text" id="fileURL" readOnly value={fileURL} className="flex-grow bg-transparent focus:outline-none" />
            <img src={CopyIcon} onClick={handleCopyURL} alt="copy to clipboard icon" className="cursor-pointer mr-4" />
          </div>
        </div>
      )}
      {showEmailForm && (
        <div className="email-container mt-4 max-w-96">
          <p className="email-info">Or Send via Email</p>
          <div className="email-form bg-gray-200 border border-gray-400 rounded-lg p-4 mt-2">
            <form onSubmit={handleEmailSubmit}>
              <div className="field mb-4">
                <label htmlFor="fromEmail" className="block">Your email</label>
                <input type="email" autoComplete="email" required name="from-email" id="fromEmail" className="w-full border border-gray-300 rounded px-2 py-1" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} />
              </div>
              <div className="field mb-4">
                <label htmlFor="toEmail" className="block">Receiver's email</label>
                <input type="email" required autoComplete="receiver" name="to-email" id="toEmail" className="w-full border border-gray-300 rounded px-2 py-1" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />
              </div>
              <div className="send-btn-container">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Send</button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

