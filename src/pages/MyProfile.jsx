import { useState } from "react";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";

function MyProfile() {
  const [editing, setEditing] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState({
    name: user?.name,
    email: user?.email,
    location: user?.location,
    phone: user?.phone,
    photoUrl: user?.photoUrl,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="mt-20 p-6 max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-300">
      <div className="flex flex-col items-center">
        <img
          src={profile.photoUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-md mb-4 object-scale-down"
        />
        {editing ? (
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="text-2xl font-semibold mb-2 border-b-2 focus:outline-none"
          />
        ) : (
          <h2 className="text-2xl font-semibold mb-2">{profile.name}</h2>
        )}
        <div className="flex items-center gap-2">
          <Pencil
            className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setEditing(!editing)}
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-600">Phone</label>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none"
            />
          ) : (
            <p className="text-gray-800">{profile.email}</p>
          )}
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-600">Email</label>
          {editing ? (
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none"
            />
          ) : (
            <p className="text-gray-800">{profile.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Location</label>
          {editing ? (
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none"
            />
          ) : (
            <p className="text-gray-800">{profile.location}</p>
          )}
        </div>
      </div>
      {editing && (
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setEditing(false)}
        >
          Save
        </button>
      )}
    </div>
  );
}

export default MyProfile;