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
