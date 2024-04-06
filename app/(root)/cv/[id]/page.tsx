import CVCard from "@/components/cards/CVCard";
import Comment from "@/components/forms/Comment";
import { fetchCVById } from "@/lib/actions/cv.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("choosing/onboarding-individual");

  const cv = await fetchCVById(params.id);

  return (
    <section className="relative">
      <div>
        <CVCard
          key={cv._id}
          id={cv._id}
          currentUserId={user?.id || ""}
          parentId={cv.parentId}
          content={cv.text}
          author={cv.author}
          community={cv.community}
          createdAt={cv.createdAt}
          comments={cv.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          cvId={params.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {cv.children.map((childItem: any) => (
          <CVCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
