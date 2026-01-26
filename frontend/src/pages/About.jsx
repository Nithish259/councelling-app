import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="mx-4 md:mx-24">
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-90" src={assets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            HealSpace was created with a simple mission — to make mental health
            support more accessible, comfortable, and human in the digital
            world. We understand that reaching out for help can feel
            overwhelming. That’s why HealSpace provides a safe and structured
            online space where clients can connect with qualified counsellors,
            book sessions with ease, and communicate openly through secure video
            and chat tools.
          </p>
          <p>
            Our platform blends technology with empathy. From booking
            appointments and attending live WebRTC video sessions to accessing
            session history and counsellor notes, HealSpace is designed to make
            the entire counseling journey smooth, private, and supportive.
            Whether someone is seeking guidance, emotional support, or
            professional therapy, HealSpace aims to remove barriers and bring
            care closer — one session at a time.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision is to create a world where mental health support is as
            accessible as any other essential service. HealSpace strives to
            become a trusted digital bridge between individuals and mental
            health professionals, empowering people to seek help without
            hesitation, stigma, or logistical barriers. We believe technology
            can play a powerful role in improving emotional well-being when it
            is built with care, privacy, and human connection at its core. By
            continuously improving our platform and expanding access to quality
            counselling services, we aim to support healthier minds, stronger
            relationships, and more resilient communities.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row  mb-20">
        <div className="border px-10 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-400 hover:text-white transition-all duration-300 text-gray-600">
          <b>Efficiency:</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="border px-10 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-400 hover:text-white transition-all duration-300 text-gray-600">
          <b>Convenience:</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border px-10 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-400 hover:text-white transition-all duration-300 text-gray-600">
          <b>Personization:</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your mind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
