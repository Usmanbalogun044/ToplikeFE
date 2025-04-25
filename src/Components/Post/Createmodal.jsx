import { useState } from "react";
import { FiX, FiUpload, FiImage, FiVideo } from "react-icons/fi";

const Createmodal = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: null,
    isVideo: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      formPayload.append("media", formData.media);
      formPayload.append("isVideo", formData.isVideo);

      const res = await fetch(
        "https://toplike.up.railway.app/api/post/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: formPayload,
        }
      );

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Create Submission</h3>
          <button onClick={onClose} className="text-gray-500">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Media</label>
            <div className="flex items-center space-x-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!formData.isVideo}
                  onChange={() => setFormData({ ...formData, isVideo: false })}
                  className="mr-2"
                />
                <FiImage className="mr-1" /> Image
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.isVideo}
                  onChange={() => setFormData({ ...formData, isVideo: true })}
                  className="mr-2"
                />
                <FiVideo className="mr-1" /> Video
              </label>
            </div>
            <input
              type="file"
              accept={formData.isVideo ? "video/*" : "image/*"}
              required
              onChange={(e) =>
                setFormData({ ...formData, media: e.target.files[0] })
              }
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Pay ₦500 & Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createmodal;
