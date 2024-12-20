import { uploadImage } from "../utils/upload.utils";
import { useState } from "react";

function InputImage({ setNewListing, newListing }: any) {
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const imageUrl = await uploadImage(file);
        setNewListing({
          ...newListing,
          image: imageUrl, // Set the uploaded image URL
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {loading && (
        <p className="text-center my-2">Uploading Image to the cloud...</p>
      )}
      {newListing.image && <img src={newListing.image} alt="uploaded image" />}
    </div>
  );
}

export default InputImage;
