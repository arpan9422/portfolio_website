"use client";

import { Github, Linkedin, Mail, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import PhotonBeam from "../ui/photon-beam";
import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");

      // Reset back to idle after 4s
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="w-[90vw] mx-auto my-20 md:my-32">
      <div className="mb-10 w-full text-center lg:text-left">
        <h2 className="text-4xl md:text-5xl font-mono font-semibold text-white">Contact Me</h2>
        <p className="text-gray-400 mt-4 text-lg">Let&apos;s talk about your next project.</p>
      </div>

      <section className="bg-black text-white py-16 px-6 md:px-20 min-h-[60vh] flex items-center relative overflow-hidden rounded-3xl border border-gray-800 shadow-2xl">
        {/* Background Photon Beam */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-80">
          <div className="w-[105%] h-full md:h-[600px] -ml-[5%]">
            <PhotonBeam
              colorLine="#005f6f"
              colorSignal="#00d9ff"
              colorSignal2="#00ffff"
              colorSignal3="#00b8d4"
              lineCount={80}
              spreadHeight={35}
              curveLength={60}
              straightLength={120}
              signalCount={94}
              speedGlobal={0.345}
              trailLength={3}
              bloomStrength={3.0}
              bloomRadius={0.5}
            />
          </div>
        </div>

        <div className="max-w-8xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 md:pl-16">
          {/* Left Side */}
          <div>
            <div className="flex items-center gap-4 mb-4 md:hidden">
              <span className="w-8 bg-gray-600 block"></span>
              <p className="text-gray-400 uppercase tracking-[0.4em] text-xl font-bold">contact me</p>
            </div>
          </div>

          {/* Right Side: Form & Socials */}
          <div className="bg-[#111111]/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl min-w-[30vw]">
            <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a1a1a]/80 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition text-white placeholder-gray-500"
                  placeholder="Your Name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a]/80 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition text-white placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#1a1a1a]/80 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition text-white placeholder-gray-500 resize-none"
                  placeholder="How can I help you?"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "sending" || status === "success"}
                className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition
                  ${status === "success"
                    ? "bg-green-500 text-white cursor-default"
                    : status === "error"
                    ? "bg-red-600 text-white"
                    : "bg-white text-black hover:bg-gray-200"
                  }`}
              >
                {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "success" && <CheckCircle2 className="h-4 w-4" />}
                {status === "error"   && <AlertCircle  className="h-4 w-4" />}
                {status === "idle"    && <Send className="h-4 w-4" />}

                {status === "idle"    && "Send Message"}
                {status === "sending" && "Sending…"}
                {status === "success" && "Message Sent!"}
                {status === "error"   && "Failed — Try Again"}
              </button>
            </form>

            <hr className="border-gray-800 mb-8" />

            {/* Social Links */}
            <div className="space-y-4">
              <a href="mailto:arpanagrawal552@gmail.com" className="flex items-center gap-4 group">
                <Mail className="text-gray-400 group-hover:text-white transition" />
                <span className="border-b border-gray-600 pb-1">arpanagrawal552@gmail.com</span>
              </a>
              <a href="https://github.com/arpan9422" className="flex items-center gap-4 group">
                <Github className="text-gray-400 group-hover:text-white transition" />
                <span className="border-b border-gray-600 pb-1">github.com/arpan9422</span>
              </a>
              <a href="https://www.linkedin.com/in/arpan-agrawal-2a65a7275/" className="flex items-center gap-4 group">
                <Linkedin className="text-gray-400 group-hover:text-white transition" />
                <span className="border-b border-gray-600 pb-1">linkedin.com/in/arpan-agrawal-2a65a7275</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}