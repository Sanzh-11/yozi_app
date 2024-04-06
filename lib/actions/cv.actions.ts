"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import CV from "../models/cv.model";
import Community from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = CV.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await CV.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createCV({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdCV = await CV.create({
      text,
      author,
      community: communityIdObject,
    });

    await User.findByIdAndUpdate(author, {
      $push: { cv: createdCV._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { cv: createdCV._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create cv: ${error.message}`);
  }
}

async function fetchAllChildCVs(cvId: string): Promise<any[]> {
  const childCVs = await CV.find({ parentId: cvId });

  const descendantCVs = [];
  for (const childCV of childCVs) {
    const descendants = await fetchAllChildCVs(childCV._id);
    descendantCVs.push(childCV, ...descendants);
  }

  return descendantCVs;
}

export async function deleteCV(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    const mainCV = await CV.findById(id).populate("author community");

    if (!mainCV) {
      throw new Error("CV not found");
    }

    const descendantCVs = await fetchAllChildCVs(id);

    const descendantcvIds = [id, ...descendantCVs.map((cv) => cv._id)];

    const uniqueAuthorIds = new Set(
      [
        ...descendantCVs.map((cv) => cv.author?._id?.toString()),
        mainCV.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantCVs.map((cv) => cv.community?._id?.toString()),
        mainCV.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    await CV.deleteMany({ _id: { $in: descendantcvIds } });

    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { cv: { $in: descendantcvIds } } }
    );

    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { cv: { $in: descendantcvIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete cv: ${error.message}`);
  }
}

export async function fetchCVById(cvId: string) {
  connectToDB();

  try {
    const cv = await CV.findById(cvId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: CV,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return cv;
  } catch (err) {
    console.error("Error while fetching cv:", err);
    throw new Error("Unable to fetch cv");
  }
}

export async function addCommentToCV(
  cvId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const originalCV = await CV.findById(cvId);

    if (!originalCV) {
      throw new Error("CV not found");
    }

    const commentCV = new CV({
      text: commentText,
      author: userId,
      parentId: cvId,
    });

    const savedCommentCV = await commentCV.save();

    originalCV.children.push(savedCommentCV._id);

    await originalCV.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
