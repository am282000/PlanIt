"use client";

import { OrganizationList } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

const Onboarding = () => {
  // const { organization } = useOrganization();
  // const router = useRouter();
  /* Auto Redirect to organization logic - causing issue */
  // useEffect(() => {
  //   console.log("organization: ", organization);
  //   if (organization) {
  //     router.push(`/organization/${organization.slug}`);
  //   }
  // }, [organization]);
  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
};

export default Onboarding;
