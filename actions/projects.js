/**
 * Check for valid user, organization
 * Go for member detail
 * Only admins can create project
 * Take data from arguments and and create a new project in Project's table
 */
"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

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
    console.log("project: ", project);
    return project;
  } catch (error) {
    throw new Error("Error creating Project: " + error.message);
  }
}
