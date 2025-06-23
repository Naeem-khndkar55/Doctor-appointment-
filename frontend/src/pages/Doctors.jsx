import React from "react";
import { useParams } from "react-router-dom";
const Doctors = () => {
  const { speciality } = useParams();
  return <div>Doctors</div>;
};

export default Doctors;
