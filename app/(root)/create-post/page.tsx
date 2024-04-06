import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostCV from "@/components/forms/PostCV";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  //   console.log("userInfo: ", userInfo);
  return (
    <>
      <h1 className="head-text">Заявите о себе</h1>

      <PostCV userId={userInfo._id} />
    </>
  );
}

export default Page;
