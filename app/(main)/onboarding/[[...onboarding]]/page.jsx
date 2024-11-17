"use client";

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Onboarding = () => {
  const { organization } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    console.log("organization: ", organization);
    if (organization) {
      router.push(`/organization/${organization.slug}`);
    }
  }, [organization]);
  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList hidePersonal />
    </div>
  );
};

export default Onboarding;