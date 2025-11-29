import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileAvatar = () => {
  return (
    <Avatar>
      <AvatarImage className="object-cover" src="https://homebusinessmag.com/wp-content/uploads/2020/03/recycle-symbol-and-items-scaled-e1585005600616.jpg" />
      <AvatarFallback>PF</AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
