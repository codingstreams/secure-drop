import { Link } from "react-router-dom";

interface FooterProps { }

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="hidden md:flex flex-none justify-center 
items-center gap-6 py-4 text-drop-accent text-xs tracking-wider opacity-60 
font-mono mb-2">
      <Link to="/about" className="hover:text-blue-400">ABOUT</Link>
      <span>//</span>
      <Link to="/terms" className="hover:text-blue-400">TERMS</Link>
      <span>//</span>
      <p>v1.0.0 MVP</p>
    </footer>
  );
};

export default Footer;