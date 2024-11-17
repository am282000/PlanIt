import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/org-switcher";

const Organization = async ({ params }) => {
  const { orgId } = params;
  const organization = await getOrganization(orgId);
  console.log("Organization: ", organization);

  if (!organization) {
    return <div>No Organization Found</div>;
  }
  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}'s Projects
        </h1>
        {/* Organization Switcher */}
        <OrgSwitcher />
      </div>
      <div className="mb-4"> Show Organization Projects</div>
      <div className="mt-8"> Show User assigned and reported issues here</div>
    </div>
  );
};

export default Organization;
