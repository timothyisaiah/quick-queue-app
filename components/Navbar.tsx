import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        {session ? (
          <>
            <li>Hello, {session.user?.name}</li>
            <li>
              <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
            </li>
          </>
        ) : (
          <li><Link href="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
