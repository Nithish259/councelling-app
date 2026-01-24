import { useContext, useState } from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const CouncellorProfile = () => {
  const {
    councellorData,
    setCouncellorData,
    backendUrl,
    token,
    loadCouncellorProfileData,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  if (!councellorData) return null;

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/councellor/updateProfile`,
        councellorData,
        { headers: { token } },
      );

      if (data.status === "Success") {
        toast.success("Profile updated");
        loadCouncellorProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Counsellor Profile</h2>

      <input
        disabled={!isEdit}
        value={councellorData.name}
        onChange={(e) =>
          setCouncellorData({ ...councellorData, name: e.target.value })
        }
        className="border p-2 rounded w-full mb-2"
      />

      <input
        disabled={!isEdit}
        value={councellorData.speciality}
        onChange={(e) =>
          setCouncellorData({ ...councellorData, speciality: e.target.value })
        }
        className="border p-2 rounded w-full mb-2"
      />

      <textarea
        disabled={!isEdit}
        value={councellorData.about}
        onChange={(e) =>
          setCouncellorData({ ...councellorData, about: e.target.value })
        }
        className="border p-2 rounded w-full mb-2"
      />

      <input
        disabled={!isEdit}
        value={councellorData.fees}
        onChange={(e) =>
          setCouncellorData({ ...councellorData, fees: e.target.value })
        }
        className="border p-2 rounded w-full mb-2"
      />

      {isEdit ? (
        <button
          onClick={updateProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setIsEdit(true)}
          className="border px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default CouncellorProfile;
