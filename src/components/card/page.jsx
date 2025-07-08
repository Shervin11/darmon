import React from "react";

const Card = ({ h, p }) => {
  return (
    <div>
      <img src={"/cross.png"} alt="hero" />
      <h3 className="font-bold text-[24px] mt-[20px] mb-[5px] text-[#2c94a1]">
        {h}
      </h3>
      <p>{p}</p>
    </div>
  );
};

export default Card;
