/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { HiChevronDoubleRight } from "react-icons/hi";

const Hero: React.FC = () => {
  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700 overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 pt-24 pb-16 lg:flex lg:items-center lg:justify-between">
        
        {/* LEFT SIDE */}
        <div className="max-w-2xl text-left">
          <h1 className="text-4xl font-extrabold sm:text-6xl text-black dark:text-white leading-tight drop-shadow-lg">
            Zenith<span className="text-blue-600 dark:text-blue-400">.</span>
            <span className="block text-2xl sm:text-3xl font-semibold mt-4 text-gray-700 dark:text-gray-300">
              Empower Your Future with Skills That Matter
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
            Learn, grow, and unlock new possibilities in your career. Join a
            vibrant community where ambition meets opportunity.
          </p>

          <div className="mt-10">
            <Link href={"/sign-in"}>
              <Button
                variant="default"
                size="lg"
                className="group transition-transform duration-300 hover:scale-105"
              >
                Sign In
                <HiChevronDoubleRight className="text-xl ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE SVG */}
        <div className="mt-16 lg:mt-0 lg:w-1/2">
          <img
            src="/homepage.png" // update path if needed
            alt="Career Growth Illustration"
            className="w-full max-w-lg mx-auto lg:mx-0 drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
