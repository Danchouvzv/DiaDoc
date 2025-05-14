import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/landing');
  return null; // redirect will ensure this is not rendered
}
