import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "../db";

type LoaderData = {
  id: number;
  title: string;
  votes: number;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let votes = Number(formData.get("votes"));
  let id = formData.get("id");

  db.prepare(`UPDATE post SET votes = ${votes + 1} WHERE id = ${id};`).run();

  return json("ok");
};

export const loader: LoaderFunction = async ({ params }) => {
  console.log("--- LOADER BEGIN");
  let { id } = params;
  invariant(id, "id is required");
  console.log("--- LOADER DB BEGIN");
  let post = db.prepare(`SELECT * FROM post WHERE ${id} ;`).get();
  console.log("--- LOADER DB END");
  console.log("--- LOADER END");
  return json<LoaderData>(post);
};

function PostItem({ post }: { post: LoaderData[0] }) {
  let fetcher = useFetcher();
  return (
    <fetcher.Form method="post">
      <div>
        <input type="hidden" name="id" value={post.id} />
        <button type="submit" name="votes" value={post.votes}>
          {post.votes}
        </button>
        <Link to={post.id.toString()}>{post.title}</Link>
      </div>
    </fetcher.Form>
  );
}
export default function Index() {
  let post = useLoaderData<LoaderData>();

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Post detail</h2>
      <PostItem key={post.id} post={post} />
    </div>
  );
}
