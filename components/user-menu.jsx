import { UserButton } from "@clerk/nextjs";

const UserMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    ></UserButton>
  );
};

export default UserMenu;
