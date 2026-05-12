import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://crickbet:crickbuzzbettingXXXX@cricbuzz.40erabd.mongodb.net/";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  firstName: String,
  lastName: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacherName: String,
  category: String,
  tags: [String],
  thumbnail: String,
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  estimatedDuration: Number,
  isPublished: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const CourseModel = mongoose.models.Course || mongoose.model('Course', courseSchema);

const courses = [
  {
    title: "Anglų kalba pradedantiesiems: Pirmieji žingsniai",
    description: "Pradėkite savo anglų kalbos kelionę nuo pagrindų! Šis kursas skirtas tiems, kurie nori išmokti anglų kalbos nuo nulio.",
    shortDescription: "Pradėkite mokytis anglų kalbos nuo nulio su aiškiomis ir praktiškomis pamokomis.",
    category: "english",
    difficulty: "beginner",
    estimatedDuration: 40,
    rating: 4.9,
    totalRatings: 215,
    tags: ["pradedantieji", "bazinė-gramatika", "žodynas"],
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  },
  {
    title: "Kasdienė anglų kalba: Pokalbiai ir situacijos",
    description: "Mokykitės kalbėti angliškai realiose situacijose – parduotuvėje, kavinėje, darbe, pas gydytoją.",
    shortDescription: "Praktiniai pokalbiai kasdienėms situacijoms – nuo parduotuvės iki kelionių.",
    category: "english",
    difficulty: "intermediate",
    estimatedDuration: 55,
    rating: 4.8,
    totalRatings: 178,
    tags: ["pokalbiai", "kasdienė-kalba"],
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  },
  {
    title: "Anglų kalbos gramatika: Aiškiai ir paprastai",
    description: "Gramatika neturi būti nuobodi! Šiame kurse išmoksite svarbiausias anglų kalbos gramatikos taisykles.",
    shortDescription: "Svarbiausios gramatikos taisyklės, paaiškintos aiškiai ir paprastai lietuvių kalba.",
    category: "english",
    difficulty: "intermediate",
    estimatedDuration: 65,
    rating: 4.7,
    totalRatings: 142,
    tags: ["gramatika", "laikai"],
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
  },
  {
    title: "Verslo anglų kalba: Profesionaliam bendravimui",
    description: "Kursas skirtas profesionalams, kurie nori užtikrintai bendrauti anglų kalba darbo aplinkoje.",
    shortDescription: "Profesionalus anglų kalbos kursas verslui – laiškai, susitikimai, pristatymai.",
    category: "english",
    difficulty: "advanced",
    estimatedDuration: 50,
    rating: 4.8,
    totalRatings: 96,
    tags: ["verslas", "profesionalu"],
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
  },
  {
    title: "Anglų kalbos tartis: Kalbėk aiškiai ir užtikrintai",
    description: "Tobulinkite savo anglų kalbos tartį! Šis kursas padės jums išmokti taisyklingai tarti anglų kalbos garsus.",
    shortDescription: "Tobulinkite anglų kalbos tartį su praktiniais garso pratimais.",
    category: "english",
    difficulty: "beginner",
    estimatedDuration: 30,
    rating: 4.9,
    totalRatings: 203,
    tags: ["tartis", "garsai"],
    thumbnail: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&h=400&fit=crop",
  },
  {
    title: "Pasiruošimas IELTS egzaminui",
    description: "Išsamus kursas pasiruošti IELTS egzaminui. Apima visas keturias dalis: Listening, Reading, Writing ir Speaking.",
    shortDescription: "Pasiruoškite IELTS egzaminui su strategijomis ir praktinėmis užduotimis.",
    category: "english",
    difficulty: "advanced",
    estimatedDuration: 80,
    rating: 4.6,
    totalRatings: 87,
    tags: ["IELTS", "egzaminas"],
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Create/Update Admin
    const hashedPassword = await bcrypt.hash("admin123456", 10);
    const admin = await UserModel.findOneAndUpdate(
      { email: "admin@stepbystep.com" },
      {
        username: "superadmin",
        email: "admin@stepbystep.com",
        password: hashedPassword,
        role: "admin",
        firstName: "Super",
        lastName: "Admin",
      },
      { upsert: true, new: true }
    );
    console.log("Admin account ready");

    // 2. Create/Update Teacher
    const teacherPassword = await bcrypt.hash("teacher123456", 10);
    const teacher = await UserModel.findOneAndUpdate(
      { email: "evelina@stepbystep.com" },
      {
        username: "evelina_teacher",
        email: "evelina@stepbystep.com",
        password: teacherPassword,
        role: "teacher",
        firstName: "Evelina",
        lastName: "Language",
      },
      { upsert: true, new: true }
    );
    console.log("Teacher account ready");

    // 3. Create Courses
    await CourseModel.deleteMany({});
    for (const c of courses) {
      const course = new CourseModel({
        ...c,
        teacherId: teacher._id,
        teacherName: "Evelina Language",
      });
      await course.save();
    }
    console.log(`Created ${courses.length} courses`);

    await mongoose.disconnect();
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seed();
