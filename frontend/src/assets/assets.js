import appointment_img from "./optimized_appointment_img.webp";
import header_img from "./optimized_header_img.webp";
import group_profiles from "./optimized_group_profiles.webp";
import contact_image from "./optimized_contact_image.webp";
import about_image from "./optimized_about_image.webp";
import verified_icon from "./verified_icon.svg";
import mental_health_therapy from "./optimized_mental_health_therapy.webp";
import addiction_behavioral_councelling from "./optimized_addiction_behavioral_councelling.webp";
import career_work_stress from "./optimized_career_work_stress.webp";
import personal_growth_life_coaching from "./optimized_personal_growth_life_coaching.webp";
import youth_studuent_councelling from "./optimized_youth_studuent_councelling.webp";
import relationship_marriage from "./optimized_relationship_marriage.webp";
import healspacelogo from "./healspace-logo.jpg";

export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  healspacelogo,
  verified_icon,
  contact_image,
  about_image,
};

export const counselorSpecialties = [
  {
    category: "Mental Health & Therapy",
    specialties: [
      "Anxiety & Stress",
      "Depression",
      "Trauma & PTSD",
      "OCD",
      "Bipolar Disorder",
      "Phobias",
      "Anger Management",
      "Self-esteem Issues",
    ],
    image: mental_health_therapy,
  },
  {
    category: "Relationship & Marriage",
    specialties: [
      "Couples Therapy",
      "Marriage Counseling",
      "Breakup & Divorce Recovery",
      "Infidelity Recovery",
      "Family Counseling",
      "Parenting Therapy",
    ],
    image: relationship_marriage,
  },
  {
    category: "Youth & Student Counseling",
    specialties: [
      "Exam Stress",
      "Career Pressure",
      "ADHD",
      "Peer Pressure",
      "Bullying",
      "Social Anxiety",
      "Study Motivation",
    ],
    image: youth_studuent_councelling,
  },
  {
    category: "Career & Work Stress",
    specialties: [
      "Career Guidance",
      "Work Stress",
      "Burnout",
      "Job Anxiety",
      "Workplace Toxicity",
      "Leadership Coaching",
      "Public Speaking",
    ],
    image: career_work_stress,
  },
  {
    category: "Personal Growth & Life Coaching",
    specialties: [
      "Life Coaching",
      "Confidence Building",
      "Goal Setting",
      "Habit Change",
      "Mindfulness",
      "Motivation",
      "Time Management",
    ],
    image: personal_growth_life_coaching,
  },
  {
    category: "Addiction & Behavioral Counseling",
    specialties: [
      "Smoking Addiction",
      "Alcohol Addiction",
      "Drug Addiction",
      "Porn Addiction",
      "Gaming Addiction",
      "Social Media Addiction",
    ],
    image: addiction_behavioral_councelling,
  },
];
