"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Check for valid user, organization
 * Go for member detail
 * Only admins can create project
 * Take data from arguments and and create a new project in Project's table
 */
export async function createProject(data) {
  const { userId, orgId } = auth();
  if (!userId) {
    throw new Error("Unauthorized User");
  }
  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  const { data: memberShipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });
  const memberDetail = memberShipList.find(
    (member) => member.publicUserData.userId === userId
  );
  if (!memberDetail || memberDetail.role !== "org:admin") {
    throw new Error("Only Organization admins can create Projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });
    // console.log("project: ", project);
    return project;
  } catch (error) {
    throw new Error("Error creating Project: " + error.message);
  }
}

/*
 * Getting all projected associated with an organization ID
 */

export async function getProjects(orgId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized User");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const projects = await db.project.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

/*
 * Check use , orgId is related to Project , and role is admin than only delete
 */
export async function deleteProject(projectId) {
  const { userId, orgId, orgRole } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized User");
  }
  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete the project");
  }
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }
  await db.project.delete({
    where: { id: projectId },
  });
  return { success: true };
}

/**
 * Get project and sprints in it using project id
 */
export async function getProject(projectId) {
  // console.log("projectId: ", projectId, auth());

  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized User");
  }
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!project) {
    return null;
  }

  //Verify project belongs to the organization
  if (project.organizationId !== orgId) {
    return null;
  }
  return project;
}
