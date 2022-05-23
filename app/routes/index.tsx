import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "../db";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type LoaderData = {
  id: number;
  title: string;
  votes: number;
}[];
export const action: ActionFunction = async ({ request }) => {
  console.log("--- ACTION BEGIN");
  const formData = await request.formData();
  let votes = Number(formData.get("votes"));
  let id = formData.get("id");

  await sleep(1000);

  console.log("--- ACTION DB BEGIN");
  db.prepare(`UPDATE post SET votes = ${votes + 1} WHERE id = ${id};`).run();
  console.log("--- ACTION DB END");

  console.log("--- ACTION END");
  return json("ok");
};
export const loader: LoaderFunction = async () => {
  let posts = db.prepare("SELECT * FROM post;").all();
  return json<LoaderData>(posts);
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
  let posts = useLoaderData<LoaderData>();

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Post list</h2>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
