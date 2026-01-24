import { useContext, useState } from "react";
import { AppContext } from "../context/Context";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const {
    role,
    clientData,
    councellorData,
    setClientData,
    setCouncellorData,
    backendUrl,
    token,
    loadingProfile,
    loadClientProfileData,
    loadCouncellorProfileData,
  } = useContext(AppContext);

  const profileData = role === "client" ? clientData : councellorData;
  const setProfileData = role === "client" ? setClientData : setCouncellorData;

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  if (loadingProfile) {
    return (
      <div className="text-center py-20 text-gray-500">Loading profile...</div>
    );
  }

  if (!profileData) return null;

  const updateProfileData = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      formData.append("name", profileData.name || "");
      if (image) formData.append("image", image);

      if (role === "client") {
        formData.append("phone", profileData.phone || "");
        formData.append("gender", profileData.gender || "");
        formData.append("dob", profileData.dob || "");
        formData.append("address", JSON.stringify(profileData.address || {}));
      } else {
        formData.append("speciality", profileData.speciality || "");
        formData.append("fees", profileData.fees || "");
        formData.append("degree", profileData.degree || "");
        formData.append("experience", profileData.experience || "");
        formData.append("about", profileData.about || "");
        formData.append("available", profileData.available ? "true" : "false");
        formData.append("address", JSON.stringify(profileData.address || {}));
      }

      const endpoint =
        role === "client"
          ? "/api/client/updateProfile"
          : "/api/councellor/updateProfile";

      const { data } = await axios.post(`${backendUrl}${endpoint}`, formData, {
        headers: { token },
      });

      if (data.status === "Success") {
        toast.success(data.message);
        role === "client"
          ? loadClientProfileData()
          : loadCouncellorProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow">
      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center md:text-left">
          <label className="cursor-pointer relative">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : profileData.image || assets.default_avatar
              }
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-200"
            />

            {isEdit && (
              <>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <img
                  src={assets.upload_icon}
                  className="w-7 absolute bottom-2 right-2"
                />
              </>
            )}
          </label>

          {isEdit ? (
            <input
              className="mt-4 text-lg sm:text-xl font-semibold text-center md:text-left border-b outline-none"
              value={profileData.name || ""}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, name: e.target.value }))
              }
            />
          ) : (
            <h2 className="mt-4 text-lg sm:text-xl font-semibold">
              {profileData.name}
            </h2>
          )}

          <p className="text-sm text-gray-500 break-all">{profileData.email}</p>

          {role === "councellor" && (
            <span
              className={`mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                profileData.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {profileData.available ? "Online" : "Offline"}
            </span>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 space-y-6">
          {role === "councellor" && (
            <div className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3">
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p
                  className={`font-semibold ${
                    profileData.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {profileData.available
                    ? "Available for sessions"
                    : "Currently offline"}
                </p>
              </div>

              {isEdit && (
                <button
                  type="button"
                  onClick={() =>
                    setProfileData((p) => ({
                      ...p,
                      available: !p.available,
                    }))
                  }
                  className={`w-14 h-8 rounded-full relative transition ${
                    profileData.available ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      profileData.available ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          )}

          {role === "client" && (
            <>
              <ProfileField
                label="Phone"
                isEdit={isEdit}
                value={profileData.phone}
                onChange={(v) => setProfileData((p) => ({ ...p, phone: v }))}
              />
              <ProfileField
                label="Gender"
                type="select"
                isEdit={isEdit}
                value={profileData.gender}
                onChange={(v) => setProfileData((p) => ({ ...p, gender: v }))}
              />
              <ProfileField
                label="Date of Birth"
                type="date"
                isEdit={isEdit}
                value={
                  profileData.dob
                    ? new Date(profileData.dob).toISOString().slice(0, 10)
                    : ""
                }
                onChange={(v) => setProfileData((p) => ({ ...p, dob: v }))}
              />
            </>
          )}

          {role === "councellor" && (
            <>
              <ProfileField
                label="Speciality"
                isEdit={isEdit}
                value={profileData.speciality}
                onChange={(v) =>
                  setProfileData((p) => ({ ...p, speciality: v }))
                }
              />
              <ProfileField
                label="Fees (₹)"
                isEdit={isEdit}
                value={profileData.fees}
                onChange={(v) => setProfileData((p) => ({ ...p, fees: v }))}
              />
              <ProfileField
                label="Degree"
                isEdit={isEdit}
                value={profileData.degree}
                onChange={(v) => setProfileData((p) => ({ ...p, degree: v }))}
              />
              <ProfileField
                label="Experience"
                isEdit={isEdit}
                value={profileData.experience}
                onChange={(v) =>
                  setProfileData((p) => ({ ...p, experience: v }))
                }
              />
              <ProfileField
                label="About"
                type="textarea"
                isEdit={isEdit}
                value={profileData.about}
                onChange={(v) => setProfileData((p) => ({ ...p, about: v }))}
              />
            </>
          )}

          {/* ACTION BUTTON */}
          <div className="flex justify-center md:justify-end pt-4">
            {isEdit ? (
              <button
                disabled={saving}
                onClick={updateProfileData}
                className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="w-full md:w-auto border border-blue-600 text-blue-600 px-6 py-2 rounded-full"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, isEdit, onChange, type = "text" }) => (
  <div>
    <p className="text-gray-500 text-sm mb-1">{label}</p>

    {isEdit ? (
      type === "textarea" ? (
        <textarea
          className="w-full border rounded p-2 text-sm"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : type === "select" ? (
        <select
          className="w-full border rounded p-2 text-sm"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      ) : (
        <input
          type={type}
          className="w-full border rounded p-2 text-sm"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    ) : (
      <p className="font-medium text-sm sm:text-base">{value || "-"}</p>
    )}
  </div>
);

export default MyProfile;
