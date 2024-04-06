"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { CVValidation } from "@/lib/validations/cv";
import { createCV } from "@/lib/actions/cv.actions";

interface Props {
  userId: string;
}

function PostCV({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof CVValidation>>({
    resolver: zodResolver(CVValidation),
    defaultValues: {
      cv: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof CVValidation>) => {
    await createCV({
      text: values.cv,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="cv"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-lg font-semibold leading-relaxed text-light-2">
                Напишите о себе, своих достижениях и кем вы являетесь.
                <br />
                <br />
                <span className="block">
                  (Дополнительно) Прикрепите ссылки на другие сайты (гитхаб,
                  линкедин и тд)
                </span>
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Заявить о себе
        </Button>
      </form>
    </Form>
  );
}

export default PostCV;
