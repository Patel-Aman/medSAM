import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link href="/" className="text-lg font-bold text-gray-800">
        NFT Marketplace
      </Link>
    </nav>
  );
};

export default Navbar;
