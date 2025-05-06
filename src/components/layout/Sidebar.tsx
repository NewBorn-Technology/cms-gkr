import Link from 'next/link';
import { BookOpen, Calendar, Home, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      <Link
        href="/home"
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          pathname === '/home'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Home className="mr-3 h-5 w-5" />
        Dashboard
      </Link>
      <Link
        href="/church-events"
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          pathname === '/church-events'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Calendar className="mr-3 h-5 w-5" />
        Church Events
      </Link>
      <Link
        href="/devotions"
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          pathname === '/devotions'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <BookOpen className="mr-3 h-5 w-5" />
        Devotions
      </Link>
      <Link
        href="/community"
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          pathname === '/community'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Users className="mr-3 h-5 w-5" />
        Community
      </Link>
    </div>
  );
};

export default Sidebar; 