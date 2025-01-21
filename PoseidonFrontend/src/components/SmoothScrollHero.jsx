import { ReactLenis } from "lenis/dist/lenis-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowRight, FiBook, FiUser } from "react-icons/fi";
import { useRef } from "react";
import Navbar from "./Navbar";
import Athena from '../images/PerfectAthenaPhotoUpdated2.png'
import AthenaChat from '../HomePageImages/AthenaChat.png';
import FeedbackImage from '../HomePageImages/Feedback.png';
import ResponseAndGrading from '../HomePageImages/ResponseAndGrading.png';
import Rubric from '../HomePageImages/Rubric.png';
import TeacherDashboard from '../HomePageImages/TeacherDashboard.png';


export const SmoothScrollHero = () => {
  return (
    <div className="bg-zinc-950">
      {/* <ReactLenis
        root
        options={{
          lerp: 10000,
          
        }}
      > */}
        <Navbar />
        <Hero />
        <Features />
      {/* </ReactLenis> */}
    </div>
  );
};


const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterAnimation />

      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

const CenterAnimation = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1000], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1000], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-white"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${Athena})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0, ease: "easeInOut" }}
        className="text-5xl font-bold"
      >
        Athena
      </motion.h1>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0, ease: "easeInOut" }}
        className="text-lg mt-4"
      >
        Empowering Education Through Innovation
      </motion.p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section
      id="features-section"
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50"
      >
        Features
      </motion.h1>
      <FeatureItem
        title="AI Grading"
        description="Automated grading tailored for educators."
        icon={<FiBook />}
      />
      <FeatureItem
        title="Personalized Learning"
        description="Tailored learning paths for every student."
        icon={<FiUser />}
      />
      <FeatureItem
        title="Student Analytics"
        description="Actionable insights into student performance."
        icon={<FiBook />}
      />
    </section>
  );
};

const FeatureItem = ({ title, description, icon }) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};
