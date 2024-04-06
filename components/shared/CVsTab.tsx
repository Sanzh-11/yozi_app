import { redirect } from "next/navigation";

// import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";

import CVCard from "../cards/CVCard";

interface Result {
  name: string;
  image: string;
  id: string;
  cv: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function CVsTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result;
  result = await fetchUserPosts(accountId);

  //   if (accountType === "Community") {
  //     result = await fetchCommunityPosts(accountId);
  //   } else {
  //     result = await fetchUserPosts(accountId);
  //   }

  if (!result) {
    redirect("/");
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.cv.map((cv) => (
        <CVCard
          key={cv._id}
          id={cv._id}
          currentUserId={currentUserId}
          parentId={cv.parentId}
          content={cv.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: cv.author.name,
                  image: cv.author.image,
                  id: cv.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : cv.community
          }
          createdAt={cv.createdAt}
          comments={cv.children}
        />
      ))}
    </section>
  );
}

export default CVsTab;
