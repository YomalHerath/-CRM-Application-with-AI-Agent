import { useState, ChangeEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { API_BASE_URL, IMG_BASE_URL } from "../../config/api";

export default function UserMetaCard() {
  const { user, updateUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    title: user?.title || "",
    country: user?.country || "",
    city: user?.city || "",
    social_facebook: user?.social_facebook || "",
    social_twitter: user?.social_twitter || "",
    social_linkedin: user?.social_linkedin || "",
    social_instagram: user?.social_instagram || "",
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!user) return;

    // 1. Upload Photo if selected
    if (photo) {
      const photoData = new FormData();
      photoData.append("photo", photo);
      fetch(`${API_BASE_URL}/profile?id=${user.id}`, {
        method: "POST",
        body: photoData
      })
        .then(res => res.json())
        .then(data => {
          if (data.photo) {
            updateUser({ photo: data.photo });
          }
        })
        .catch(err => console.error("Photo upload error", err));
    }

    // 2. Update Profile Data
    fetch(`${API_BASE_URL}/profile?id=${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          updateUser(data.user);
          closeModal();
          // Reset modal data to match new user data
          setFormData({
            name: data.user.name || "",
            phone: data.user.phone || "",
            bio: data.user.bio || "",
            title: data.user.title || "",
            country: data.user.country || "",
            city: data.user.city || "",
            social_facebook: data.user.social_facebook || "",
            social_twitter: data.user.social_twitter || "",
            social_linkedin: data.user.social_linkedin || "",
            social_instagram: data.user.social_instagram || "",
          });
        } else {
          alert("Error updating profile");
        }
      })
      .catch(err => console.error("Profile update error", err));
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src={user?.photo ? `${IMG_BASE_URL}${user.photo}` : "/images/user/owner.jpg"} alt="user" className="w-full h-full object-cover" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.name || "User"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.title || "Member"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.city ? `${user.city}, ` : ""}{user?.country || "Anywhere"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Profile Photo
                </h5>
                <div className="mb-6">
                  <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-gray-800 dark:file:text-gray-400" />
                </div>

                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      name="social_facebook"
                      value={formData.social_facebook}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label>Twitter (X)</Label>
                    <Input type="text" name="social_twitter" value={formData.social_twitter} onChange={handleInputChange} />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      name="social_linkedin"
                      value={formData.social_linkedin}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input type="text" name="social_instagram" value={formData.social_instagram} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Full Name</Label>
                    <Input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Job Title</Label>
                    <Input type="text" name="title" value={formData.title} onChange={handleInputChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Bio/Role</Label>
                    <Input type="text" name="bio" value={formData.bio} onChange={handleInputChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Country</Label>
                    <Input type="text" name="country" value={formData.country} onChange={handleInputChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>City</Label>
                    <Input type="text" name="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
