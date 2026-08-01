import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";

export default function Profile() {
  const { username } = useParams();
  const cleanUsername = username?.replace(/^@/, "");
  const { user: me, updateUser } = useAuth();
  console.log("PROFILE PARAM:", username);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", avatar: "", website: "" });
  const [following, setFollowing] = useState(false);

  const isMe = me?.username === cleanUsername;

  const load = async () => {
    setLoading(true);
    const [profileRes, postsRes] = await Promise.all([
      api.get(`/users/${cleanUsername}`),
      api.get(`/posts?author=${cleanUsername}&limit=50`),
    ]);
    setProfile(profileRes.data);
    setPosts(postsRes.data.posts);
    setForm({
      name: profileRes.data.name,
      bio: profileRes.data.bio || "",
      avatar: profileRes.data.avatar || "",
      website: profileRes.data.website || "",
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanUsername]);

  const saveProfile = async () => {
    const res = await api.put("/users/me", form);
    setProfile((p) => ({ ...p, ...res.data }));
    updateUser(res.data);
    setEditing(false);
  };

  const toggleFollow = async () => {
    const res = await api.put(`/users/${profile._id}/follow`);
    setFollowing(res.data.following);
    setProfile((p) => ({ ...p, followersCount: res.data.followersCount }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  if (loading) return <Loader label="Loading profile" />;
  if (!profile) return <div className="text-center py-24 text-stone">User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <div className="flex flex-col items-center text-center">
        <img
          src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=2B2033&color=fff&size=128`}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-line"
        />
        <h1 className="font-display text-3xl font-semibold mt-4">{profile.name}</h1>
        <p className="text-stone text-sm font-mono">@{profile.username}</p>
        {profile.bio && <p className="max-w-md mt-3 text-ink">{profile.bio}</p>}

        <div className="flex gap-6 mt-5 text-sm font-mono text-stone">
          <span><strong className="text-ink">{posts.length}</strong> stories</span>
          <span><strong className="text-ink">{profile.followersCount}</strong> followers</span>
          <span><strong className="text-ink">{profile.followingCount}</strong> following</span>
        </div>

        <div className="mt-5">
          {isMe ? (
            <button
              onClick={() => setEditing((v) => !v)}
              className="px-5 py-2 rounded-full border border-line text-sm font-medium hover:border-signal transition-colors"
            >
              {editing ? "Cancel" : "Edit profile"}
            </button>
          ) : me ? (
            <button
              onClick={toggleFollow}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                following ? "border border-line text-stone" : "bg-ink text-paper hover:bg-signal"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          ) : null}
        </div>
      </div>

      {editing && (
        <div className="max-w-md mx-auto mt-10 space-y-4 border border-line rounded-lg p-6 bg-paper-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-line rounded-lg px-4 py-2 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              maxLength={200}
              className="w-full border border-line rounded-lg px-4 py-2 text-sm bg-paper resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Website</label>
            <input
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="w-full border border-line rounded-lg px-4 py-2 text-sm bg-paper"
            />
          </div>
          <button
            onClick={saveProfile}
            className="w-full bg-ink text-paper py-2.5 rounded-full font-medium hover:bg-signal transition-colors"
          >
            Save changes
          </button>
        </div>
      )}

      <div className="mt-14">
        <h2 className="font-display text-xl font-semibold mb-4 border-b border-line pb-4">
          Stories by {profile.name}
        </h2>
        {posts.length === 0 ? (
          <p className="text-stone text-sm py-8">No stories published yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}
