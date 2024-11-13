import MobileHeader from './ui/header';
import SideNav from './ui/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative min-h-screen w-full'>
      <aside className='fixed top-0 left-0 w-[220px] md:w-[280px] h-full border-r bg-white z-0 hidden md:block'>
        <SideNav />
      </aside>
      <div className='ml-0 md:ml-[280px] flex flex-col'>
        <MobileHeader />
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
