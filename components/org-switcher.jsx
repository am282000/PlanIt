"use client";
import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const OrgSwitcher = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded || !isUserLoaded) {
    return null;
  }
  return (
    // By default create organization take user to /onboarding so this createOrganizationMode to avoid here and open modal
    // createOrganizationUrl - If a user don't have access of any orz and not a member too show Create Org button
    <div>
      <OrganizationSwitcher
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug`"
        afterSelectOrganizationUrl="`/organization/:slug`"
        createOrganizationMode={
          pathname === "/onboarding" ? "navigation" : "modal"
        }
        createOrganizationUrl="/onboarding"
      />
    </div>
  );
};

export default OrgSwitcher;
