import CVCard from "@/components/cards/CVCard";
import { fetchPosts } from "@/lib/actions/cv.actions";
import { currentUser } from "@clerk/nextjs";

async function Home() {
  const result = await fetchPosts(1, 5);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Главная</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">Записей пока нет</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <CVCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      {/* <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> */}
    </>
  );
}

export default Home;
