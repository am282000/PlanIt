/*
 * To fetch organization details -
 ** Get userId from Clerk Login
 ** Get user detials for User Table
 ** Get organization detials , and members of it
 ** If authntic user and associated with organization return organization
 *  */

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
