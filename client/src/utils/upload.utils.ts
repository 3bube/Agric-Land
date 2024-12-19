export const uploadImage = async (files: File) => {
  const formData = new FormData();

  formData.append("file", files);
  formData.append("upload_preset", "ml_default");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dvogkq9do/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.url;
  } catch (error) {
    console.log(error);
  }
};
