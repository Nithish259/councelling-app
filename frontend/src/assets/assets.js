import appointment_img from "./appointment_img.png";
import header_img from "./header_img.png";
import group_profiles from "./group_profiles.png";
import contact_image from "./contact_image.png";
import about_image from "./about_image.png";
import verified_icon from "./verified_icon.svg";
import mental_health_therapy from "./mental_health_therapy.png";
import addiction_behavioral_councelling from "./addiction_behavioral_councelling.png";
import career_work_stress from "./career_work_stress.png";
import personal_growth_life_coaching from "./personal_growth_life_coaching.png";
import youth_studuent_councelling from "./youth_studuent_councelling.png";
import relationship_marriage from "./relationship_marriage.png";
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
