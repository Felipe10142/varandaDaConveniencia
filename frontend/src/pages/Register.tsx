import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import { motion } from "framer-motion";
import Ribbons from "../components/animations/Ribbons";
const RegisterPage: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-20 relative overflow-hidden"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <Ribbons
          baseThickness={20}
          colors={["#D62828", "#F77F00"]}
          speedMultiplier={0.3}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={true}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <RegisterForm />
      </div>
    </motion.div>
  );
};
export default RegisterPage;
