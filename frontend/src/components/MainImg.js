import { Parallax, useParallax } from "react-scroll-parallax";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const detail = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.4,
    },
  },
};

const child = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity:1,
    transition: { duration: 0.5 }
  }
};

const MainImg = () => {
  const {scrollYProgress} = useScroll();
  const scale = useTransform(scrollYProgress, [0,1], [1,1.2])

  return (
    <motion.div
      className="main__container"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="main__img" style={{scale: scale}}>
        <div className="main__label">
          <img src="./img/label.png" />
        </div>
      </motion.div>
      <motion.div variants={detail}>
        <motion.img
          variants={child}
          src="./img/spark1.svg"
          className="main__img--01"
        />

        <motion.img
          variants={child}
          src="./img/cloud3.svg"
          className="main__img--02"
        />
        <motion.img
          variants={child}
          src="./img/spark2.svg"
          className="main__img--03"
        />
        <motion.img
          variants={child}
          src="./img/spark1.svg"
          className="main__img--04"
        />
        <motion.img
          variants={child}
          src="./img/cloud2.svg"
          className="main__img--05"
        />
        <motion.img
          variants={child}
          src="./img/cloud1.svg"
          className="main__img--06"
        />
        <motion.img
          variants={child}
          src="./img/spark2.svg"
          className="main__img--07"
        />
        <motion.img
          variants={child}
          src="./img/spark1.svg"
          className="main__img--08"
        />
      </motion.div>
    </motion.div>
  );
};

export default MainImg;
