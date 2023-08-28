import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Animation = () => {
  const transition = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] };

  return (
    <div className="wrapper">
      <div className="wrapper-test"></div>
      <motion.div className="animation">
      <motion.div className="animation__color" exit={{opacity:0}}></motion.div>
      <motion.div className="animation__img">
        <motion.img
          src="./img/purple-jar.png"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.img
          src="./img/yellow-jar.png"
          className="animation__img--initial"
          exit={{ opacity: 1 }}
        />
        <div className="animation__label">
          <motion.img
            src="./img/label.png"
            exit={{ x: -375 }}
            transition={transition}
          />
        </div>
      </motion.div> 
      <motion.div
        className="animation__star"
        key="star1"
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <img src="./img/star1.svg" />
      </motion.div>
      <motion.div
        className="animation__star2"
        key="star2"
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <img src="./img/star2.svg" />
      </motion.div>
      <motion.div
        className="animation__cloud"
        key="cloud1"
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <img src="./img/cloud1.svg" />
      </motion.div>
      <motion.div
        className="animation__cloud2"
        key="cloud2"
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <img src="./img/cloud2.svg" />
      </motion.div>
      <motion.div
        className="animation__desc"
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <div className="animation__text">
          Conocela a la humectante, y mucho más entrando a nuestro sitio haciendo click acá.<br />
        </div>
        <Link to={"/home"}>
          <div className="animation__button">
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </Link>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default Animation;
