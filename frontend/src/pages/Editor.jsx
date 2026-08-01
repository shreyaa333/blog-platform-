import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

export default function Editor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditing);

  // Because the public GET /api/posts/:slug looks up by slug, load-by-id for editing
  // is handled by searching the author's own posts on mount when id is a Mongo ObjectId.
  useEffect(() => {
    if (!isEditing || !user) return;
    setLoading(true);
    api.get(`/posts?author=${user.username}&limit=100`).then((res) => {
      const found = res.data.posts.find((p) => p._id === id);
      if (found) {
        setTitle(found.title);
        setSubtitle(found.subtitle || "");
        setCoverImage(found.coverImage || "");
        setTags((found.tags || []).join(", "));
        setContent(found.content);
      }
      setLoading(false);
    });
  }, [isEditing, id, user]);

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async (publish) => {
    if (!title.trim() || !content.trim()) {
      setError("Title and story content are required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      content,
      coverImage,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: publish,
    };

    try {
      let res;
      if (isEditing) {
        res = await api.put(`/posts/${id}`, payload);
      } else {
        res = await api.post("/posts", payload);
      }
      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-5 py-24 text-center text-stone">Loading story...</div>;

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-display text-2xl font-semibold mb-8">
        {isEditing ? "Edit story" : "Write a new story"}
      </h1>

      {error && (
        <div className="bg-signal/10 border border-signal/30 text-signal-dark rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-2">
            Cover image
          </label>
          {coverImage ? (
            <div className="relative">
              <img src={coverImage} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
              <button
                onClick={() => setCoverImage("")}
                className="absolute top-3 right-3 bg-ink/80 text-paper text-xs px-3 py-1 rounded-full"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center border-2 border-dashed border-line rounded-lg aspect-video cursor-pointer hover:border-signal transition-colors text-stone text-sm">
              Click to upload a cover image
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          )}
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full font-display text-3xl font-semibold placeholder:text-line focus:outline-none bg-transparent"
        />

        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Add a subtitle (optional)"
          className="w-full font-display text-lg italic text-stone placeholder:text-line focus:outline-none bg-transparent"
        />

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags, comma separated (e.g. react, css, career)"
          className="w-full border border-line rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-signal/30"
        />

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Tell your story..."
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => submit(false)}
            disabled={saving}
            className="px-5 py-2.5 rounded-full border border-line text-sm font-medium hover:border-signal transition-colors disabled:opacity-40"
          >
            Save draft
          </button>
          <button
            onClick={() => submit(true)}
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-signal transition-colors disabled:opacity-40"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
