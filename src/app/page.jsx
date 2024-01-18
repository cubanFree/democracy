import Image from 'next/image'
import Logo from '../../public/logo.png'
import FormAuth from '@/components/auth/formAuth';
import Footer from '@/components/auth/footer';
import Info from '@/components/auth/info';

export default function Main() {

  return (
    <main className="flex-wrap w-full h-full xl:h-screen xl:flex">
      <div className='w-full flex flex-col justify-between p-8 bg-sub-origin xl:pl-[10%] xl:w-2/3 xl:border xl:border-gray-700'>
        <Image 
          src={Logo} 
          alt="Democracy Logo" 
          width={70} 
          priority 
          className='mx-auto xl:mx-0'
        />
        <Info />
      </div>

      <div className='w-full h-full flex flex-col justify-start items-center p-8 gap-4 xl:w-1/3 xl:justify-center'>
        <FormAuth />
        <Footer />
      </div>
    </main>
  )
}
