"use client";
import React from "react";
import Image from "next/image";
import { IoArrowForwardCircle } from "react-icons/io5";

function TeaserScreen() {
  const benefits = [
    { image: "/images/Handmade.png", text: "Save Lives" },
    { image: "/images/Handshake Heart.png", text: "Prevent deaths" },
    { image: "/images/Flower.png", text: "Prevent Stigma" },
    { image: "/images/Trust.png", text: "Provide Care" },
  ];
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="h-[100%] bg-[#C3C7D8]">
        <div className="p-6">
          <Image src="/images/logo.svg" alt="logo" width={110} height={110} className="ml-8"/>
        </div>       
        <div className="max-w-2xl h-full mt-20 justify-center ml-6 md:ml-12">
          <h1 className="text-5xl md:text-4xl mb-10 font-extrabold text-[#001F54] whitespace-nowrap">WELCOME TO HALICARE,</h1>
          <h1 className="text-5xl md:text-4xl mb-10 font-extrabold text-[#001F54] whitespace-nowrap">YOUR ALLY IN DIGITAL HEALTH SOLUTIONS</h1>
          <div className="mt-10 ml-0 md:mt-5">
            <div className="grid grid-cols-4 gap-55">
              {benefits.map((benefit) => (
                <div key={benefit.image} className="flex flex-col text-left" >
                  <div className="w-100 h-100 flex items-center justify-center bg-[#798BD7] rounded-full md:w-15 md:h-15 ml-5 p-2 mt-5">
                    <Image src={benefit.image} alt={benefit.text} width={36} height={36}/>
                  </div>
                  <p className="mt-2 text-lg  text-[#001F54] font-medium whitespace-nowrap">{benefit.text} </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-15 md:mt-20 md:right-30">
          <a href="signup"><button
                className="w-42 md:w-55 flex items-center cursor-pointer justify-center gap-10 px-6 py-3 rounded-lg bg-[#001F54] text-white font-semibold text-xl whitespace-nowrap hover:bg-[#2540B5]" >
                Proceed
               <IoArrowForwardCircle size={34} />
            </button></a>
        </div>
        </div>
        <div className="absolute top-0 right-0 w-[60%] md:w-[40%] h-full">
          <Image src="/images/teaser.svg" alt="teaser" fill className="object-contain object-top object-right"/> 
        </div>
      </div>
    </div>
  );
}
export default TeaserScreen;