/**
 * Create Issue - check Authorized user
 * Fetch user from user table
 * Fetch length of issues already in "TODO" status to know the newly created issue order
 * Create new issue
 */

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId, data) {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized User");
  }
  const user = await db.user.findUnique({
    where: {
      clerkClientId: userId,
    },
  });

  const lastIssue = await db.issue.findFirst({
    where: {
      projectId,
      status: data.status,
    },
    orderBy: {
      order: "desc",
    },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;
  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      order: newOrder,
      priority: data.priority,
      assigneeId: data.assigneeId || null,
      reporterId: user.id,
      projectId: projectId,
      sprintId: data.sprintId,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });
  return issue;
}
