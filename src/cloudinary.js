export async function uploadProfileImage(file) {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "profileimg");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/ezp1bodj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary Upload Failed");
  }

  const data = await res.json();

  return data.secure_url;
}