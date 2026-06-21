"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ImageTabs = () => {
  const [activeTab, setActiveTab] = useState("organize");

  return (
    <section className="border-t bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* TABS */}
          <div className="flex gap-2 justify-center mb-8">
            <Button onClick={() => setActiveTab("organize")}
              className={`rouded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "organize" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Organize Application
            </Button>
            <Button onClick={() => setActiveTab("hired")}
              className={`rouded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "hired" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Get Hired
            </Button>
            <Button onClick={() => setActiveTab("boards")}
              className={`rouded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "boards" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Manage Boards
            </Button>
          </div>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
            {activeTab === "organize" && <Image
              src={"/hero-images/hero1.png"}
              alt="organize application"
              width={1200}
              height={800}
            />}

            {activeTab === "hired" && <Image
              src={"/hero-images/hero2.png"}
              alt="het hired"
              width={1200}
              height={800}
            />}

            {activeTab === "boards" && <Image
              src={"/hero-images/hero3.png"}
              alt="manage boards"
              width={1200}
              height={800}
            />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImageTabs;