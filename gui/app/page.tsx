import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="main">
      <div className="nav">
        <h1 className="logo">aidify</h1>
        <Link href="/register"><button className="btn"><p>Sign up</p></button></Link>
      </div>
      <h2 className="sub">Streamlining Solutions, One Tech Support Case at a Time!</h2>
      <p className="text">goodbye to tech troubles with our Tech Support Case App – your streamlined solution for seamless problem-solving. Welcome to a world where every case brings you closer to hassle-free technology!</p>
      <Link href="/login"><button button className="btn"><p>Get started</p></button></Link>
    </main>
  );
}
