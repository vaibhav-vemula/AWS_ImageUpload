import React, { useState } from "react";
import axios from "axios";

function App() {
  const [img, setImg] = useState(null);

  const handleImage = (e) => {
    setImg(e.target.files[0]);
  };
  const uploadImage = async (e) => {
    await axios
      .get("http://localhost:8000/getsignedurl", {
        params: {
          imgname: img.name,
        },
      })
      .then((res) => {
        console.log(res.data.url);

        axios
          .put(res.data.url, img, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log("UPLOADED");
            alert('Image uploaded to S3')
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.error("err");
      });
  };

  return (
    <>
      <div className="text-center pt-20">
        <input type="file" accept="image/*" onChange={handleImage} />
        <button
          onClick={uploadImage}
          type="submit"
          className="p-3 bg-slate-400 rounded-2xl"
        >
          UPLOAD to S3
        </button>
      </div>
    </>
  );
}

export default App;
