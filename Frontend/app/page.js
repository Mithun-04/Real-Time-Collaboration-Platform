"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Avatar } from "@heroui/avatar";
import './Home.css';

export default function Home() {
  return (
    
    <div className="home-container">
      <Spotlight
        translateY={-300}
        width={600}
        height={1400}
        smallWidth={220}
        duration={6}
        xOffset={120}
      />
      <div className="content-container">
        <h1 className="heading">
          Ready-Made Collaborative features for Your Team
        </h1>
        <p className="description">
          CollabMate brings teams together with seamless tools for collaboration, creativity, and productivity—all in one intuitive platform.
        </p>
        <div className="button-group">
          <button className="primary-button">
            Get Started
          </button>
          <button className="secondary-button">
            Learn More
          </button>
        </div>

        {/* Avatars positioned like labels in the image */}
        <Avatar className="avatar avatar-1" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Avatar className="avatar avatar-2" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        <Avatar className="avatar avatar-3" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
        <Avatar className="avatar avatar-4" src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
      </div>
    </div>
  );
}