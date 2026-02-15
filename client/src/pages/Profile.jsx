import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    city: user?.location?.city || '',
    state: user?.location?.state || '',
    country: user?.location?.country || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        phone: formData.phone,
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country
        }
      };

      const { data } = await api.put('/auth/updatedetails', updateData);
      updateUser(data.data);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      country: user?.location?.country || ''
    });
    setEditing(false);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <div className="text-center">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User')}
                alt={user?.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User');
                }}
              />
              <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{user?.email}</p>
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{user?.rating?.average?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-600 text-sm">({user?.rating?.count || 0} reviews)</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.isVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-outline"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      className="input"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="1234567890"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{user?.name || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{user?.email || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="font-semibold">{user?.bio || 'No bio added yet'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{user?.phone || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">
                    {user?.location?.city || user?.location?.state || user?.location?.country
                      ? `${user.location.city || ''} ${user.location.state || ''} ${user.location.country || ''}`.trim()
                      : 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
