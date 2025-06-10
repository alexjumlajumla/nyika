import { redirect } from 'next/navigation';

type Props = {
  params: { lang: string };
};

export default function LangPage({ params }: Props) {
  // Redirect to the home route
  redirect(`/${params.lang}/home`);
}
