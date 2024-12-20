import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import CreateSprint from "../_components/create-sprint";
import SprintBoard from "../_components/sprint-board";

const ProjectPage = async ({ params }) => {
  const { projectId } = await params;
  const project = await getProject(projectId);
  // console.log("project: ", project);
  if (!project) {
    notFound();
  }
  return (
    <div>
      {/* Sprint Creation */}
      <CreateSprint
        key={project.sprints?.length}
        projectTitle={project.name}
        projectKey={project.key}
        projectId={projectId}
        sprintKey={project.sprints?.length + 1} // +1 Because in start length 0 and we are creating 1st sprint
      />

      {/* Sprint Board */}
      {project.sprints.length > 0 ? (
        <>
          <SprintBoard
            sprints={project.sprints}
            projectId={projectId}
            orgId={project.organizationId}
          />
        </>
      ) : (
        <div>Create a Sprint from the Create New Sprint button</div>
      )}
    </div>
  );
};

export default ProjectPage;
