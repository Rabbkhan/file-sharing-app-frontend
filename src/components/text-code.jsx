import React, { useState } from 'react';

const App = () => {
  const [fileURL, setFileURL] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailFrom, setEmailFrom] = useState('');

  const baseURL = "http://localhost:5555";
  const uploadURL = `${baseURL}/api/files`;
  const emailURL = `${baseURL}/api/files/send`;
  const maxAllowedSize = 100 * 1024 * 1024; //100mb

  const handleBrowseBtnClick = () => {
    document.querySelector("#fileInput").click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 1) {
      if (files[0].size < maxAllowedSize) {
        uploadFile(files[0]);
      } else {
        showToast("Max file size is 100MB");
      }
    } else if (files.length > 1) {
      showToast("You can't upload multiple files");
    }
  };

  const handleFileInputChange = () => {
    const fileInput = document.querySelector("#fileInput");
    if (fileInput.files[0].size > maxAllowedSize) {
      showToast("Max file size is 100MB");
      fileInput.value = ""; // reset the input
      return;
    }
    uploadFile(fileInput.files[0]);
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("myfile", file);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (event) {
      let percent = Math.round((100 * event.loaded) / event.total);
      setProgressPercent(percent);
    };
    xhr.upload.onerror = function () {
      showToast(`Error in upload: ${xhr.status}.`);
      document.querySelector("#fileInput").value = ""; // reset the input
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onFileUploadSuccess(xhr.responseText);
      }
    };
    xhr.open("POST", uploadURL);
    xhr.send(formData);
  };

  const onFileUploadSuccess = (res) => {
    document.querySelector("#fileInput").value = ""; // reset the input
    const { file: url } = JSON.parse(res);
    setFileURL(url);
  };

  const handleCopyURL = () => {
    const fileURLInput = document.querySelector("#fileURL");
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Copied to clipboard");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const formData = {
      uuid: fileURL.split("/").splice(-1, 1)[0],
      emailTo: emailTo,
      emailFrom: emailFrom,
    };
    fetch(emailURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showToast("Email Sent");
          setFileURL('');
        }
      });
  };

  // const showToast = (msg) => {
  //   setToastMessage(msg);
  //   setShowToast(true);
  //   setTimeout(() => {
  //     setShowToast(false);
  //   }, 2000);
  // };

  return (
    <div>
      <div className="drop-zone" onDrop={handleDrop}>
        {/* Your drop zone content */}
      </div>
      <input type="file" id="fileInput" onChange={handleFileInputChange} style={{ display: 'none' }} />
      <button id="browseBtn" onClick={handleBrowseBtnClick}>Browse</button>
      <div className="bg-progress">{progressPercent}</div>
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
      <div className="status"></div>
      <div className="sharing-container">
        <input type="text" id="fileURL" value={fileURL} readOnly />
        <button id="copyURLBtn" onClick={handleCopyURL}>Copy URL</button>
        <form id="emailForm" onSubmit={handleEmailSubmit}>
          <input type="email" name="to-email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="Recipient Email" />
          <input type="email" name="from-email" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} placeholder="Your Email" />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="toast">{toastMessage}</div>
    </div>
  );
};

export default App;