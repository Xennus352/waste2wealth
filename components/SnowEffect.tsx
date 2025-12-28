"use client";
import Snowfall from "react-snowfall";

const SnowEffect = () => {
  return (
    <div className=" z-50">
      <Snowfall snowflakeCount={200} color="#FFFAFA" />
    </div>
  );
};

export default SnowEffect;
