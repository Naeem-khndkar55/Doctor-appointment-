import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const fetchDocInfor = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    // console.log(docInfo);
  };
  const getAvaliableSlot = async () => {
    setDocSlots([]);
    //getting the date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currDate = new Date(today);
      currDate.setDate(today.getDate() + i);
      //set time slot
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      //get hours
      if (today.getDate() === currDate.getDate()) {
        currDate.setHours(
          currDate.getHours() > 10 ? currDate.getHours() + 1 : 10
        );
        currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currDate.setHours(10);
        currDate.setMinutes(0);
      }
      let timeSlots = [];
      while (currDate < endTime) {
        let formatedTime = currDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeSlots.push({
          datetime: new Date(currDate),
          time: formatedTime,
        });
        currDate.setMinutes(currDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };
  useEffect(() => {
    fetchDocInfor();
  }, [doctors, docId]);
  useEffect(() => {
    getAvaliableSlot();
  }, [docInfo]);
  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);
  return (
    docInfo && (
      <div>
        {/* doctors detais */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* doctors img*/}
          <div>
            <img
              className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          {/* doctors info */}
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm;mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree}-{docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            {/* doctors about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900  mt-3">
                About <img className="w-4" src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-4 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-[#5f6FFF] text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                  onClick={() => setSlotIndex(index)}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3  w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-[#5f6FFF] text-white"
                      : "text-gray-400 border border-gray-400"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Book an appointment
          </button>
        </div>
      </div>
    )
  );
};

export default Appointment;
