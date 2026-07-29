'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  User,
  Mail,
  Phone,
  Briefcase,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const skillOptions = [
  'Electrical',
  'Plumbing',
  'AC Repair',
  'Refrigerator Repair',
  'Washing Machine Repair',
  'Microwave Repair',
  'Television Repair',
  'RO Water Purifier',
  'Carpentry',
  'Painting',
  'Home Cleaning',
  'Pest Control',
];

export default function TechnicianProfileForm() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    mobile: '',
    experience: '',
    skills: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;

        if (!user) return;

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
  const data = docSnap.data();

    setFormData({
      name: data.name || '',
      age: data.age || '',
      gender: data.gender || '',
      email: data.email || '',
      mobile: data.mobile || '',
      experience: data.experience || '',
      skills: data.skills || [],
    });
  }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(
          (item) => item !== skill
        ),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
  };

  
    const handleSave = async () => {
  const {
    name,
    age,
    gender,
    mobile,
    experience,
    skills,
  } = formData;

  if (!name.trim()) {
    alert('Please enter your full name.');
    return;
  }

  if (!age) {
    alert('Please enter your age.');
    return;
  }

  if (Number(age) < 18 || Number(age) > 100) {
    alert('Please enter a valid age between 18 and 100.');
    return;
  }

  if (!gender) {
    alert('Please select your gender.');
    return;
  }

  if (!mobile.trim()) {
    alert('Please enter your mobile number.');
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  if (!experience) {
    alert('Please enter your years of experience.');
    return;
  }

  if (Number(experience) < 0 || Number(experience) > 60) {
    alert('Please enter a valid experience.');
    return;
  }

  if (skills.length === 0) {
    alert('Please select at least one skill.');
    return;
  }

  try {
    const user = auth.currentUser;

    if (!user) {
      router.push('/');
      return;
    }

    await updateDoc(doc(db, 'users', user.uid), {
      name: name.trim(),
      age: Number(age),
      gender,
      mobile,
      experience: Number(experience),
      skills,
    });

    alert('Profile updated successfully!');

    router.push('/technician');
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

      <h1 className="text-3xl font-bold text-[#0A2540] mb-8">
        Technician Profile
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
              className="w-full border rounded-lg pl-11 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
              value={formData.age}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full mt-2 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
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
              className="w-full border rounded-lg pl-11 p-3 bg-gray-100"
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
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border rounded-lg pl-11 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">
            Experience (Years)
          </label>

          <div className="relative mt-2">
            <Briefcase className="absolute left-3 top-3 text-gray-500" />

            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded-lg pl-11 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
                <div>
          <label className="font-medium">
            Skill Set
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {skillOptions.map((skill) => (
              <label
                key={skill}
                className="flex items-center gap-3 border rounded-lg p-3 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                  className="w-4 h-4 accent-[#0A2540]"
                />

                <span>{skill}</span>
              </label>
            ))}
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
  );
}