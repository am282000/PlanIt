"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Creating a Sprint check authentic user, find project, check organization id, create sprint
 */
export async function createSprint(projectId, data) {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized User");
  }
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not Found");
  }
  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId,
    },
  });
  return sprint;
}

/**
 * UpdateSprintStatus - Check for Authorized Users
 * FInd sprints with prject
 * Throw error if no sprint found/ project orgId is not matched
 * Only admin make changes
 * Status Transition checks
 * Update sprint newStatus
 */

export async function updateSprintStatus(sprintId, newStatus) {
  const { userId, orgId, orgRole } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized User");
  }
  const sprint = await db.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: { project: true },
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  if (sprint.project.organizationId !== orgId) {
    throw new Error("Unautthorized User");
  }
  if (orgRole !== "org:admin") {
    throw new Error("Only admins have permission to change sprint status");
  }

  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
    throw new Error("Cannot start sprint outside of its date range");
  }
  if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
    throw new Error("Can only complete an active sprint");
  }
  const updatedSprint = await db.sprint.update({
    where: { id: sprintId },
    data: { status: newStatus },
  });
  return { success: true, sprint: updatedSprint };
}
