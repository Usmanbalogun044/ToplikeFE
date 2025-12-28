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

    if (typeof onSubmit !== "function") {
      console.error("onSubmit is not a function");
      setErrors({ submit: "Form submission is not available." });
      return;
    }

    const newErrors = {};

    if (!formData.caption) {
      newErrors.caption = "Caption is required";
    }

    if (!formData.media) {
      newErrors.media = "Media file is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = new FormData();
    submitData.append("caption", formData.caption || "");
    submitData.append("post_type", formData.post_type);
    submitData.append("media[0]", formData.media);

    if (formData.music) {
      submitData.append("music", formData.music);
    }

    onSubmit(submitData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Caption Field */}
        <div>
          <label className="block text-xs font-semibold text-purple-200/80 mb-2 uppercase tracking-wide">Caption</label>
          <textarea
            className={`w-full p-4 rounded-xl focus:outline-none bg-black/20 border border-white/10 text-white placeholder-purple-300/30 transition-colors focus:border-fuchsia-500/50 min-h-[100px] resize-none ${
              errors.caption ? "border-red-500/50" : ""
            }`}
            placeholder="Write something amazing..."
            value={formData.caption}
            onChange={(e) =>
              setFormData({ ...formData, caption: e.target.value })
            }
            maxLength={200}
          />
          {errors.caption && (
            <p className="mt-1 text-xs text-red-400">{errors.caption}</p>
          )}
        </div>

        {/* Post Type Toggle */}
        <div className="flex space-x-4 bg-black/20 p-1.5 rounded-xl border border-white/5 w-fit">
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
            className={`flex items-center cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              formData.post_type === "image"
                ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20"
                : "text-purple-300/60 hover:text-white"
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
            className={`flex items-center cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              formData.post_type === "video"
                ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20"
                : "text-purple-300/60 hover:text-white"
            }`}
          >
            <FiVideo className="mr-2" /> Video
          </button>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-xs font-semibold text-purple-200/80 mb-2 uppercase tracking-wide">Media</label>
          {formData.mediaPreview ? (
            <div className="relative group">
              {formData.post_type === "video" ? (
                <video
                  src={formData.mediaPreview}
                  controls
                  className="w-full aspect-video object-cover rounded-xl bg-black border border-white/10"
                />
              ) : (
                <img
                  src={formData.mediaPreview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-xl border border-white/10"
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
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all hover:bg-white/5 hover:border-fuchsia-500/30 ${
                errors.media ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-black/20"
              }`}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                 <FiUpload className="h-8 w-8 text-fuchsia-400" />
              </div>
              <p className="text-white font-medium">
                Click to upload {formData.post_type === "video" ? "video" : "image"}
              </p>
              <p className="text-xs text-purple-300/50 mt-2">
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
            <p className="mt-2 text-xs text-red-400 pl-1">{errors.media}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-brand w-full py-3.5 text-base shadow-xl shadow-fuchsia-900/20"
        >
          {loading ? (
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               <span>{paymentInitiated ? "Submitting..." : "Posting..."}</span>
            </div>
          ) : (
            "Share Post"
          )}
        </button>

        {errors.submit && (
          <p className="text-sm text-red-400 text-center">{errors.submit}</p>
        )}
      </form>
    </>
  );
};

export default Createmodal;
