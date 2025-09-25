import { useState, useRef } from "react";
import { FiUpload, FiImage, FiVideo, FiX } from "react-icons/fi";

const Createmodal = ({ onSubmit, loading, paymentInitiated }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    caption: "",
    post_type: "image",
    music: null,
    media: null,
    mediaPreview: null,
  });

  const [errors, setErrors] = useState({}); 

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (formData.post_type === "video" && !file.type.includes("video")) {
      setErrors({ ...errors, media: "Please upload a video file" });
      return;
    }
    if (formData.post_type === "image" && !file.type.includes("image")) {
      setErrors({ ...errors, media: "Please upload an image file" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setErrors({ ...errors, media: "File size must be less than 10MB" });
      return;
    }

    setFormData({
      ...formData,
      media: file,
      mediaPreview: URL.createObjectURL(file),
    });
    setErrors({ ...errors, media: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Caption Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Caption*</label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              errors.caption ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.caption}
            onChange={(e) =>
              setFormData({ ...formData, caption: e.target.value })
            }
            maxLength={100}
          />
          {errors.caption && (
            <p className="mt-1 text-sm text-red-500">{errors.caption}</p>
          )}
        </div>

        {/* Post Type Toggle */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                post_type: "image",
                media: null,
                mediaPreview: null,
              })
            }
            className={`flex items-center cursor-pointer px-4 py-2 rounded-lg ${
              formData.post_type === "image"
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100"
            }`}
          >
            <FiImage className="mr-2" /> Image
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                post_type: "video",
                media: null,
                mediaPreview: null,
              })
            }
            className={`flex items-center cursor-pointer px-4 py-2 rounded-lg ${
              formData.post_type === "video"
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100"
            }`}
          >
            <FiVideo className="mr-2" /> Video
          </button>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Media*</label>
          {formData.mediaPreview ? (
            <div className="relative">
              {formData.post_type === "video" ? (
                <video
                  src={formData.mediaPreview}
                  controls
                  className="w-full aspect-square object-cover rounded-lg bg-black"
                />
              ) : (
                <img
                  src={formData.mediaPreview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg"
                />
              )}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    media: null,
                    mediaPreview: null,
                  })
                }
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                errors.media ? "border-red-500" : "border-gray-300"
              }`}
              onClick={() => fileInputRef.current.click()}
            >
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">
                Click to upload{" "}
                {formData.post_type === "video" ? "video" : "image"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formData.post_type === "video"
                  ? "MP4, MOV (max 10MB)"
                  : "JPG, PNG (max 10MB)"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaChange}
                accept={formData.post_type === "video" ? "video/*" : "image/*"}
                className="hidden"
              />
            </div>
          )}
          {errors.media && (
            <p className="mt-1 text-sm text-red-500">{errors.media}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg cursor-pointer font-medium flex items-center justify-center ${
            loading ? "opacity-70" : "hover:bg-purple-700"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {paymentInitiated ? "Submitting..." : "Processing..."}
            </>
          ) : (
            <> Post </>
          )}
        </button>

        {errors.submit && (
          <p className="text-sm text-red-500 text-center">{errors.submit}</p>
        )}
      </form>
    </>
  );
};

export default Createmodal;
