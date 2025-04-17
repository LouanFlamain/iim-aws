import { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { getUrl, uploadData } from "@aws-amplify/storage";

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        const sub = user.userId;

        setUserInfo({
          username: user.username,
          sub,
        });

        const { url } = await getUrl({ key: `profiles/${sub}.jpg` });
        setProfileUrl(url);
      } catch (err) {
        console.warn("❌ Aucune image trouvée ou erreur S3 :", err);
        setProfileUrl(null);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return setUploadStatus("📸 Choisis une image d'abord !");
    setUploadStatus("");

    try {
      const user = await getCurrentUser();
      const sub = user.userId;

      await uploadData({
        key: `profiles/${sub}.jpg`,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      setUploadStatus("✅ Image uploadée !");
      setPreviewUrl(null);
      setFile(null);

      const { url } = await getUrl({ key: `profiles/${sub}.jpg` });
      setProfileUrl(url);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setUploadStatus("Erreur lors de l’upload.");
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Infos utilisateur 👤</h2>
        {userInfo ? (
          <div className="flex items-center space-x-4">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profil"
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                🧑
              </div>
            )}
            <div>
              <p>
                <strong>Username :</strong> {userInfo.username}
              </p>
              <p>
                <strong>Sub :</strong> {userInfo.sub}
              </p>
            </div>
          </div>
        ) : (
          <p>Chargement des infos...</p>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          Uploader une photo de profil 📷
        </h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-4 w-32 h-32 object-cover rounded-full border"
          />
        )}

        <button
          onClick={handleUpload}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>

        {uploadStatus && <p className="mt-3 text-center">{uploadStatus}</p>}
      </div>
    </main>
  );
}

export default Dashboard;
