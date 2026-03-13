import { Github, Linkedin, Mail } from 'lucide-react'; // Using lucide-react for icons
import PhotonBeam from '../ui/photon-beam';

export default function ContactSection() {
  return (
    <div className="w-[90vw] mx-auto my-20 md:my-32">
      <div className="mb-10 w-full text-center lg:text-left">
        <h2 className="text-4xl md:text-5xl font-mono font-semibold text-white">Contact Me</h2>
        <p className="text-gray-400 mt-4 text-lg">Let's talk about your next project.</p>
      </div>
      
      <section className="bg-black text-white py-16 px-6 md:px-20 min-h-[60vh] flex items-center relative overflow-hidden rounded-3xl border border-gray-800 shadow-2xl">        {/* Background Photon Beam */}
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

        {/* We add some padding-left on md to make room for the vertical text */}
        <div className="max-w-8xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 md:pl-16">
          {/* Left Side: Text Content */}
          <div>
            {/* Mobile-only contact me (since vertical is hidden on mobile) */}
            <div className="flex items-center gap-4 mb-4 md:hidden">
              <span className="w-8 bg-gray-600 block"></span>
              <p className="text-gray-400 uppercase tracking-[0.4em] text-xl font-bold">contact me</p>
            </div>
            {/* <h1 className="text-6xl md:text-8xl font-bold tracking-tight">let's talk!</h1> */}
          </div>

          {/* Right Side: Form & Socials Card */}
          <div className="bg-[#111111]/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl min-w-[30vw]">
            <form className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full bg-[#1a1a1a]/80 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Enquiry</label>
                <textarea rows={4} className="w-full bg-[#1a1a1a]/80 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition" placeholder="How can I help you?"></textarea>
              </div>
              <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition">
                Send Message
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