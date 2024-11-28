/*
 * Get userId from Clerk Login
 * Get user detials for User Table
 * Get organization detials , and members of it
 * If authntic user and associated with organization return organization
 * */

"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug) {
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
    throw new Error("User not Found");
  }
  const organization = await clerkClient().organizations.getOrganization({
    slug,
  });
  if (!organization) {
    return null;
  }
  const { data: memberShipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const memberDetail = memberShipList.find(
    (memeber) => memeber.publicUserData.userId === userId
  );

  // If user is not a member of Orgazation
  if (!memberDetail) {
    return null;
  }
  // console.log("Authentic User: ", organization, memberDetail);
  return organization;
}

/**
 * GetOrganizationUsers - To fetch all user in an org
 * Check for Unauthorised users
 * Fetch user detials from user table
 * Organization member list - collect ids
 * Find all users detials from user table
 */

export async function getOrganizationUsers(orgId) {
  const { userId } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized User");
  }
  const user = await db.user.findUnique({
    where: {
      clerkClientId: userId,
    },
  });
  if (!user) {
    throw new Error("User not Found");
  }
  const organizationMembersDetails =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMembersDetails.data.map(
    (membership) => membership.publicUserData.userId
  );
  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        id: userIds,
      },
    },
  });
  return users;
}
