import { createClient} from '@/lib/supabase/server';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import HomeClient from '@/components/home/HomeClient';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-white">
      <Navbar user={user} />
      <Hero />
      <HomeClient />
    </main>
  );
}
