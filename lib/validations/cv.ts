import * as z from "zod";

export const CVValidation = z.object({
  cv: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  cv: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});
