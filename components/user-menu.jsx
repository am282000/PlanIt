"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGhantt } from "lucide-react";

const UserMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Organisations"
          labelIcon={<ChartNoAxesGhantt size={15} />}
          href="/onboarding"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;
