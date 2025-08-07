import Link from 'next/link';

export default function Navbar() {
  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Add Worry', href: '/add-worry' },
    { label: 'Worry Reflection', href: '/worry-reflection' },
    { label: 'Calm Corner', href: '/calm-corner' },
    { label: 'Easeboard', href: '/easeboard' }
  ];
  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">Ease</Link>
          <div className="space-x-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="space-x-2">
            <button className="px-4 py-1 border rounded text-sm">Sign In</button>
            <button className="px-4 py-1 bg-primary text-white rounded text-sm">Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
