import ProjectsPage from "./projects/page";

export default function Home({ params }: { params: { lang: string } }) {
  return <ProjectsPage params={params} />;
}
