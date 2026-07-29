'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../lib/firebase/firebase';
import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import {
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function CustomerProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    mobile: '',
    address: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        router.push('/');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData({
            ...formData,
            ...docSnap.data(),
          });
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const { name, age, gender, mobile, address } = formData;

    if (
      !name.trim() ||
      !age ||
      !gender ||
      !mobile.trim() ||
      !address.trim()
    ) {
      alert('Please fill all the fields.');
      return;
    }

    if (Number(age) < 18 || Number(age) > 100) {
      alert('Please enter a valid age.');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert('User not found.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        age: Number(age),
        gender,
        mobile,
        address: address.trim(),
      });

      alert('Profile updated successfully!');

      router.push('/customer');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-[#0A2540] mb-8">
          My Profile
        </h1>

        <div className="space-y-6">

          <div>
            <label className="font-medium">
              Full Name
            </label>

            <div className="relative mt-2">
              <User className="absolute left-3 top-3 text-gray-500" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border rounded-lg pl-11 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="font-medium">
                Age
              </label>

              <input
                type="number"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full mt-2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-medium">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

          </div>

          <div>
            <label className="font-medium">
              Email
            </label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 text-gray-500" />

              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full border rounded-lg pl-11 p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="font-medium">
              Mobile Number
            </label>

            <div className="relative mt-2">
              <Phone className="absolute left-3 top-3 text-gray-500" />

              <input
                type="tel"
                name="mobile"
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full border rounded-lg pl-11 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-medium">
              Address
            </label>

            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-3 text-gray-500" />

              <textarea
                rows={4}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full border rounded-lg pl-11 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#0A2540] hover:bg-[#12395f] text-white py-3 rounded-xl font-semibold transition"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}