import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
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
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

function CVCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Prfile Image"
                fill
                className="cursor-pointer"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-light-1 text-base-semibold">
                {author.name}
              </h4>
            </Link>

            <p
              className={`${
                isComment && "mb-10"
              }mt-2 text-small-regular text-light-2`}
            >
              {content}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Link href={`/cv/${id}`}>
                  <Image
                    src="/assets/repost.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CVCard;
