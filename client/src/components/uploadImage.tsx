import { uploadImage } from "../utils/upload.utils";

function InputImage({ setNewListing, newListing }: any) {
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        setNewListing({
          ...newListing,
          image: imageUrl, // Set the uploaded image URL
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {newListing.image && <img src={newListing.image} alt="uploaded image" />}
    </div>
  );
}

export default InputImage;
