import { GetStaticPaths } from "next";
import ErrorPage from "next/error";
import { Project } from "../../containers/Project";
import { ProjectCMS } from "../../services/ProjectContext";
import { fetchProject, fetchProjects } from "../api/project";

interface ProjectsPageProps {
  meta: {
    title: string;
    description: string;
  };
  data: ProjectCMS;
  type: string;
}

const ProjectPageSlug = (props: ProjectsPageProps) => {
  if (!props || props === undefined || Object.keys(props).length === 0) {
    return <ErrorPage statusCode={404} />;
  }

  const { meta, data, type } = props;
  const project = data;

  return <Project project={project} meta={meta} />;
};

export default ProjectPageSlug;

type Params = {
  params: {
    slug: string | string[];
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects: Array<ProjectCMS> | null = await fetchProjects();
  const paths = projects.map((project: ProjectCMS) => {
    const params: Params = { params: { slug: project.slug } };
    return params;
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: Params) => {
  const { slug } = params;

  // specific project
  const slugComplete = typeof slug === "string" ? slug : slug.join("/");

  const project: ProjectCMS | null = await fetchProject(slugComplete);

  if (!project || project === undefined) {
    return { props: {} };
  }

  return {
    props: {
      meta: {
        title: `${project.title} | IFMakerSD`,
        description: `${project.description} | IFMakerSD`,
      },
      data: project,
      type: "single",
    },
  };
};
